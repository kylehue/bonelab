const vector = require("../../../lib/vector.js");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");
const uuid = require("uuid");
let closeObjects = [];

const Matter = require("matter-js");
const Body = Matter.Body;

class Zombie {
	constructor(body) {
		this.body = body;
		this.id = uuid.v4();
		this.position = vector();
		this.angle = utils.random(-Math.PI, Math.PI);
		this.fieldOfView = config.zombie.fieldOfView;
		this._nearestBarrierPoint = vector();
		this._nearestBarrierLength = vector();
		this._positionNext = vector();
		this.lastAngleChange = Date.now();
		this.angleChangeDelay = 0;
		this.label = "zombie";

		this.radius = config.zombie.radius;

		//Stats
		this.health = 100;
	}

	addToQuadtree(quadtree) {
		quadtree.insert({
			x: this.body.position.x - this.radius,
			y: this.body.position.y - this.radius,
			width: this.radius,
			height: this.radius,
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
			x: Math.cos(this.angle) * config.zombie.speed,
			y: Math.sin(this.angle) * config.zombie.speed
		});

		this.position.set(this.body.position);

		this.handleBulletCollision(room);
		this.findTargets();

		if (this.health <= 0) {
			room.removeZombie(this.id);
		}
	}

	handleBulletCollision(room) {
		for(var i = 0; i < closeObjects.length; i++){
			let object = closeObjects[i].self;
			if (object.label !== "bullet") continue;
			let distance = this.position.dist(object.position);
			let radii = this.radius + object.radius;
			if (distance < this.radius) {
				this.health -= 10;
				room.removeBullet(object.id);
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
}

module.exports = {
	create: function(body) {
		return new Zombie(body);
	}
}