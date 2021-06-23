const uuid = require("uuid");
const config = require("../../../lib/config.js");

class Bullet {
	constructor(playerId, options) {
		this.playerId = playerId;
		this.id = uuid.v4();
		this.position = options.position;
		this.positionOrigin = this.position.copy();
		this.angle = options.angle;
		this.radius = config.bullet.radius;
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