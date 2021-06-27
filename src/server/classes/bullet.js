const uuid = require("uuid");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");
const shape = require("../../../lib/shape.js");

let closeObjects = [];

class Bullet {
	constructor(playerId, options) {
		this.playerId = playerId;
		this.id = uuid.v4();
		this.position = options.position;
		this.positionOrigin = this.position.copy();
		let recoil = 0.03;
		this.angle = options.angle + utils.random(-Math.PI * recoil, Math.PI * recoil);
		this.radius = config.bullet.radius;
		this.shape = shape.circle(this.position.x, this.position.y, this.radius);
		this.label = "bullet";
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
			width: this.radius * 2,
			height: this.radius * 2
		});

		this.position.add({
			x: Math.cos(this.angle) * config.bullet.speed,
			y: Math.sin(this.angle) * config.bullet.speed
		});

		this.shape.translate(this.position.x, this.position.y);

		for(var i = 0; i < closeObjects.length; i++){
			let object = closeObjects[i].self;
			if (object.label !== "barrier") continue;
			if (shape.SAT(this.shape, object.body))	 {
				room.removeBullet(this.id);
				break;
			}
		}

		if (this.position.dist(this.positionOrigin) > config.bullet.range) {
			room.removeBullet(this.id);
		}
	}
}

module.exports = {
	create: function(playerId, options) {
		return new Bullet(playerId, options);
	}
}