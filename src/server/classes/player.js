const vector = require("../../../lib/vector.js");
const config = require("../../../lib/config.js");
const utils = require("../../../lib/utils.js");

class Player {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.angle = options.angle;
		this.radius = options.radius;
		this.mouse = vector();
		this.lastShoot = Date.now();
	}

	update(room) {
		this.solveMapBoundsCollision(room);
	}

	solveBarrierCollision(room) {
		
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
		this.position.y -= config.player.speed;
	}

	moveRight() {
		this.position.x -= config.player.speed;
	}

	moveDown() {
		this.position.y += config.player.speed;
	}

	moveLeft() {
		this.position.x += config.player.speed;
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