const vector = require("../../../lib/vector.js");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");
let closeObjects = [];

const Matter = require("matter-js");
const Body = Matter.Body;

class Player {
	constructor(id, body) {
		this.id = id;
		this.body = body;
		this.position = vector(this.body.position);
		this.velocity = vector();
		this.angle = this.body.angle;
		this.radius = config.player.radius;
		this.mouse = vector();
		this.lastShoot = Date.now();
		this.movingX = false;
		this.movingY = false;
		this.label = "player";
		//Stats
		this.health = 100;
	}

	addToQuadtree(quadtree) {
		quadtree.insert({
			x: this.body.position.x - this.radius,
			y: this.body.position.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2,
			self: this
		});
	}

	update(room) {
		closeObjects = room.quadtree.retrieve({
			x: this.body.position.x - this.radius,
			y: this.body.position.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2
		});

		Body.applyForce(this.body, this.body.position, {
			x: this.velocity.x,
			y: this.velocity.y
		});

		this.velocity.limit(config.player.speed);

		if (!this.movingX) {
			this.velocity.x = utils.lerp(this.velocity.x, 0, 0.4);
		}

		if (!this.movingY) {
			this.velocity.y = utils.lerp(this.velocity.y, 0, 0.4);
		}

		this.position.set(this.body.position);
		this.movingX = false;
		this.movingY = false;
	}

	handleBulletCollision() {
		for(var i = 0; i < closeObjects.length; i++){
			let object = closeObjects[i].self;
			if (object.label !== "bullet") continue;
			if (this.id === object.playerId) continue;
			let distance = this.position.dist(object.position);
			let radii = this.radius + object.radius;
			if (distance <= radii) {
				this.health -= 2;
			}
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
		if (Date.now() - this.lastShoot > 20) {
			room.addBullet(this.id, {
				position: this.position.copy(),
				angle: this.position.heading(this.mouse)
			});

			this.lastShoot = Date.now();
		}
	}
}

module.exports = {
	create: function(id, body) {
		return new Player(id, body);
	}
}