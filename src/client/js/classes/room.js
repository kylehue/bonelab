const client = require("./../client.js");
const vector = require("../../../../lib/vector.js");
const config = require("../../../../lib/config.js");
const Player = require("./player.js");
const Bullet = require("./bullet.js");
const Barrier = require("./barrier.js");

class Room {
	constructor(id, options) {
		options = options || {};

		//Important properties
		this.id = id;
		this.index = options.index || -1;
		this.description = options.description || "";
		this.password = options.password || "";
		this.maxWave = options.maxWave || -1;
		this.currentWave = options.currentWave || -1;

		//Other properties
		this.size = options.size || -1;
		this.background = options.background || "";

		//Objects
		this.players = [];
		this.bullets = [];
		this.barriers = [];
	}

	render(renderer) {
		//Draw the background
		renderer.rect(-this.size / 2, -this.size / 2, this.size, this.size, {
			fill: this.background
		});

		//Draw the players
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			player.render(renderer);
		}

		//Draw the bullets
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			bullet.render(renderer);
		}

		//Draw the barriers
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			barrier.render(renderer);
		}
	}

	update() {
		//Update the players
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			player.update();
		}

		//Update the bullets
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			bullet.update();
		}
	}

	getPlayer(id) {
		let player = this.players.find(p => p.id === id) || null;
		return player;
	}

	addPlayer(id, options) {
		let player = Player.create(id, options);
		this.players.push(player);
		return player;
	}

	removePlayer(id) {
		let player = this.getPlayer(id);
		if (player) {
			this.players.splice(this.players.indexOf(player), 1);
		}
	}

	getBullet(id) {
		let bullet = this.bullets.find(b => b.id === id) || null;
		return bullet;
	}

	addBullet(id, options) {
		let bullet = Bullet.create(id, options);
		this.bullets.push(bullet);
		return bullet;
	}

	removeBullet(id) {
		let bullet = this.getBullet(id);
		if (bullet) {
			this.bullets.splice(this.bullets.indexOf(bullet), 1);
		}
	}

	getBarrier(id) {
		let barrier = this.barriers.find(b => b.id === id) || null;
		return barrier;
	}

	addBarrier(id, options) {
		let barrier = Barrier.create(id, options);
		this.barriers.push(barrier);
		return barrier;
	}

	removeBarrier(id) {
		let barrier = this.getBarrier(id);
		if (barrier) {
			this.barriers.splice(this.barriers.indexOf(barrier), 1);
		}
	}
}

module.exports = {
	create: function (id, options) {
		return new Room(id, options);
	}
};