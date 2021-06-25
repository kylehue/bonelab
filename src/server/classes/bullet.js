const uuid = require("uuid");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");

class Bullet {
	constructor(playerId, options) {
		this.playerId = playerId;
		this.id = uuid.v4();
		this.position = options.position;
		this.positionOrigin = this.position.copy();
		let recoil = 0.03;
		this.angle = options.angle + utils.random(-Math.PI * recoil, Math.PI * recoil);
		this.radius = config.bullet.radius;

		this.label = "bullet";
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
		this.position.add({
			x: Math.cos(this.angle) * config.bullet.speed,
			y: Math.sin(this.angle) * config.bullet.speed
		});

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