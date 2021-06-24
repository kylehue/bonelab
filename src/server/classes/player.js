const vector = require("../../../lib/vector.js");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");
const shape = require("../../../lib/shape.js");
let closeObjects = [];

class Player {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.velocity = vector();
		this.angle = options.angle;
		this.radius = options.radius;
		this.mouse = vector();
		this.shape = shape.circle(this.position.x, this.position.y, this.radius);
		this.lastShoot = Date.now();
		this._nearestBarrierPoint = vector();
		this._nearestBarrierLength = vector();
		this._positionNext = vector();

		this.label = "player";
	}

	addToQuadtree(quadtree) {
		quadtree.insert({
			x: this.position.x - this.radius,
			y: this.position.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2,
			self: this
		});
	}

	update(room) {
		closeObjects = room.quadtree.retrieve({
			x: this.position.x - this.radius,
			y: this.position.y - this.radius,
			width: this.radius,
			height: this.radius
		});

		this.solveMapBoundsCollision(room);
		this.solveBarrierCollision();
		this.velocity.limit(config.player.speed);
		this.position.add(this.velocity);

		if (!this.movingX) {
			this.velocity.x = utils.lerp(this.velocity.x, 0, 0.5);
		}

		if (!this.movingY) {
			this.velocity.y = utils.lerp(this.velocity.y, 0, 0.5);
		}

		this.movingX = false;
		this.movingY = false;
	}

	solveBarrierCollision() {
		this._positionNext.set(this.position.x + this.velocity.x, this.position.y + this.velocity.y);

		for (var i = 0; i < closeObjects.length; i++) {
			let object = closeObjects[i].self;
			if (object.label !== "barrier") continue;

			this._nearestBarrierPoint.set(
				Math.max(object.position.x - object.width / 2, Math.min(this._positionNext.x, object.position.x + object.width / 2)),
				Math.max(object.position.y - object.height / 2, Math.min(this._positionNext.y, object.position.y + object.height / 2))
			);

			this._nearestBarrierLength.set(
				this._nearestBarrierPoint.x - this._positionNext.x,
				this._nearestBarrierPoint.y - this._positionNext.y
			);

			let overlap = this.radius - this._nearestBarrierLength.getMag();

			if (overlap >= 0) {
				let unit = this._nearestBarrierLength.norm();
				let speed = this.velocity.getMag();
				this._positionNext.x = this._positionNext.x - unit.x * (overlap + speed);
				this._positionNext.y = this._positionNext.y - unit.y * (overlap + speed);
			}
		}

		this.position.set(this._positionNext);
	}

	solveMapBoundsCollision(room) {
		if (this.position.x - config.map.wallWidth - this.radius <= -room.size / 2) {
			this.position.x = -room.size / 2 + config.map.wallWidth + this.radius;
		}

		if (this.position.x + config.map.wallWidth + this.radius >= room.size / 2) {
			this.position.x = room.size / 2 - config.map.wallWidth - this.radius;
		}

		if (this.position.y - config.map.wallWidth - this.radius <= -room.size / 2) {
			this.position.y = -room.size / 2 + config.map.wallWidth + this.radius;
		}

		if (this.position.y + config.map.wallWidth + this.radius >= room.size / 2) {
			this.position.y = room.size / 2 - config.map.wallWidth - this.radius;
		}
	}

	setMouse(x, y) {
		this.mouse.set(x, y);
	}

	moveUp() {
		this.velocity.y -= config.player.acceleration;
		this.movingY = true;
	}

	moveRight() {
		this.velocity.x -= config.player.acceleration;
		this.movingX = true;
	}

	moveDown() {
		this.velocity.y += config.player.acceleration;
		this.movingY = true;
	}

	moveLeft() {
		this.velocity.x += config.player.acceleration;
		this.movingX = true;
	}

	shoot(room) {
		if (Date.now() - this.lastShoot > 60) {
			room.addBullet(this.id, {
				position: this.position.copy(),
				angle: this.position.heading(this.mouse)
			});

			this.lastShoot = Date.now();
		}
	}
}

module.exports = {
	create: function(id, options) {
		return new Player(id, options);
	}
}