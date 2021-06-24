const vector = require("../../../lib/vector.js");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");
const shape = require("../../../lib/shape.js");
const uuid = require("uuid");
let closeObjects = [];

class Zombie {
	constructor(options) {
		this.id = uuid.v4();
		this.position = options.position;
		this.velocity = vector();
		this.angle = utils.random(-Math.PI, Math.PI);
		this.radius = options.radius;
		this.shape = shape.circle(this.position.x, this.position.y, this.radius);
		this.fieldOfView = config.zombie.fieldOfView;
		this._nearestBarrierPoint = vector();
		this._nearestBarrierLength = vector();
		this._positionNext = vector();
		this.lastAngleChange = Date.now();
		this.angleChangeDelay = 0;

		this.label = "zombie";
	}

	addToQuadtree(quadtree) {
		quadtree.insert({
			x: this.position.x - this.radius,
			y: this.position.y - this.radius,
			width: this.radius,
			height: this.radius,
			self: this
		});
	}

	update(room) {
		closeObjects = room.quadtree.retrieve({
			x: this.position.x - this.radius,
			y: this.position.y - this.radius,
			width: this.radius * 2,
			height: this.radius * 2
		});

		this.velocity.set({
			x: Math.cos(this.angle) * config.zombie.speed,
			y: Math.sin(this.angle) * config.zombie.speed
		});

		this.position.add(this.velocity);

		this.solveBarrierCollision();
		this.solvePlayerCollision();
		this.solveZombieCollision();
		this.findTargets();
	}

	solvePlayerCollision() {
		for(var i = 0; i < closeObjects.length; i++){
			let object = closeObjects[i].self;
			if (object.label !== "player") continue;
			let distance = this.position.dist(object.position);
			let radii = this.radius + object.radius;
			if (distance <= radii) {
				let overlap = distance - radii;
				let angle = this.position.heading(object.position);
				let displacement = {
					x: Math.cos(angle) * overlap,
					y: Math.sin(angle) * overlap
				};

				this.position.add(displacement)
			}
		}
	}

	solveZombieCollision() {
		for(var i = 0; i < closeObjects.length; i++){
			let object = closeObjects[i].self;
			if (object.label !== "zombie") continue;
			if (this === object) continue;
			let distance = this.position.dist(object.position);
			let radii = this.radius + object.radius;
			if (distance <= radii) {
				let overlap = distance - radii;
				let angle = this.position.heading(object.position);
				let displacement = {
					x: Math.cos(angle) * (overlap / 2),
					y: Math.sin(angle) * (overlap / 2)
				};

				this.position.add(displacement);
				object.position.sub(displacement)
			}
		}
	}

	findTargets() {
		this.targetFound = false;

		//Search nearby players
		for (var i = 0; i < closeObjects.length; i++) {
			let object = closeObjects[i].self;
			if (object.label !== "player") continue;
			let distance = this.position.dist(object.position);
			if (distance <= this.fieldOfView.distance /*&& this.sees(object.position)*/) {
				this.angle = this.position.heading(object.position);
				this.targetFound = true;
			}
		}

		/*if (!this.targetFound) */this.randomizeAngle();
	}

	randomizeAngle() {
		//Lots of randomizing logic
		let noise = 1200;
		if (Date.now() - this.lastAngleChange > this.angleChangeDelay) {
			this.angle += utils.random(-Math.PI * 0.2, Math.PI * 0.2);
			this.lastAngleChange = Date.now();
			this.angleChangeDelay = utils.random(noise * 0.5, noise);
		} else {
			if (this.angleChangeDelay < noise * 0.75) {
				this.angle += utils.random(0, 0.05);
			} else if (this.angleChangeDelay > noise * 0.75) {
				this.angle -= utils.random(0, 0.05);
			}
		}
	}

	sees(position, radius) {
		radius = radius || 0;
		const angle = this.position.heading(position);
		const distance = this.position.dist(position);
		return angle > this.angle - this.fieldOfView.angle / 2 && angle < this.angle + this.fieldOfView.angle / 2 && distance < this.fieldOfView.distance + radius;
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
				if (!this.targetFound) this.angle += utils.random([-Math.PI, Math.PI]) / 2;
			}
		}

		this.position.set(this._positionNext);
	}
}

module.exports = {
	create: function(options) {
		return new Zombie(options);
	}
}