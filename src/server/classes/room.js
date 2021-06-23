const uuid = require("uuid");
const Quadtree = require('@timohausmann/quadtree-js');
const Player = require("./player.js");
const Bullet = require("./bullet.js");
const Barrier = require("./barrier.js");
const config = require("../../../lib/config.js");
const vector = require("../../../lib/vector.js");
const utils = require("../../../lib/utils.js");
const shape = require("../../../lib/shape.js");

class Room {
	constructor(options) {
		options = options || {};

		//Important properties
		this.id = uuid.v4();
		this.index = options.index || -1;
		this.description = options.description || "";
		this.password = options.password || "";
		this.maxWave = options.maxWave || 0;
		this.currentWave = 1;

		//Other properties
		this.size = config.map.size || 500;
		this.background = config.map.background || "#000";

		//Objects
		this.players = [];
		this.bullets = [];

		let wallWidth = 10;
		this.barriers = [
			Barrier.create({
				position: vector(0, -this.size / 2 + wallWidth / 2),
				width: this.size,
				height: wallWidth
			}),
			Barrier.create({
				position: vector(this.size / 2 - wallWidth / 2, 0),
				width: wallWidth,
				height: this.size
			}),
			Barrier.create({
				position: vector(0, this.size / 2 - wallWidth / 2),
				width: this.size,
				height: wallWidth
			}),
			Barrier.create({
				position: vector(-this.size / 2 + wallWidth / 2, 0),
				width: wallWidth,
				height: this.size
			})
		];

		//Add random barriers
		let addBarrierStart = Date.now();
		for (var i = 0; i < config.map.maxBarriers; i++) {
			let pos = this.getRandomPosition();
			let width = utils.random(config.barrier.min.width, config.barrier.max.width);
			let height = utils.random(config.barrier.min.height, config.barrier.max.height);
			let newBarrier = Barrier.create({
				position: pos,
				width: width,
				height: height
			});

			//Don't let the new barrier spawn on top of other barriers
			for (var j = 0; j < this.barriers.length; j++) {
				let otherBarrier = this.barriers[j];
				if (shape.SAT(newBarrier.shape, otherBarrier.shape)) {
					pos = this.getRandomPosition();
					width = utils.random(config.barrier.min.width, config.barrier.max.width);
					height = utils.random(config.barrier.min.height, config.barrier.max.height);
					newBarrier = Barrier.create({
						position: pos,
						width: width,
						height: height
					});

					//Safety leverage in case the new barrier gets stuck at finding its own position
					if (Date.now() - addBarrierStart > 2000) break;

					j = -1;
				}
			}

			this.barriers.push(newBarrier);
		}
	}

	getPlayer(id) {
		let player = this.players.find(p => p.id === id);
		return player;
	}

	addPlayer(id) {
		let player = Player.create(id, {
			position: this.getRandomPosition(),
			radius: config.player.radius
		});
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
		let bullet = this.bullets.find(b => b.id === id);
		return bullet;
	}

	addBullet(playerId, options) {
		let bullet = Bullet.create(playerId, options);
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
		let barrier = this.barriers.find(b => b.id === id);
		return barrier;
	}

	addBarrier(options) {
		let barrier = Barrier.create(options);
		this.barriers.push(barrier);
		return barrier;
	}

	removeBarrier(id) {
		let barrier = this.getBarrier(id);
		if (barrier) {
			this.barriers.splice(this.barriers.indexOf(barrier), 1);
		}
	}

	getRandomPosition() {
		let x = utils.random(-this.size / 2, this.size / 2);
		let y = utils.random(-this.size / 2, this.size / 2);
		return vector(x, y);
	}
}

module.exports = {
	create: function(options) {
		return new Room(options);
	}
};