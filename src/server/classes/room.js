const uuid = require("uuid");
const Quadtree = require('@timohausmann/quadtree-js');
const Player = require("./player.js");
const Zombie = require("./zombie.js");
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
		this.quadtree = new Quadtree({
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		});

		this.players = [];
		this.zombies = [];
		this.bullets = [];

		//Add walls
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
		let minSpacing = 50;
		let sizeOffset = Math.pow(this.size, 0.6);
		let addBarrierStart = Date.now();
		for (var i = 0; i < this.size * 0.02; i++) {
			let pos = this.getRandomPosition();
			let width = utils.random(config.barrier.min.width + sizeOffset / 2, config.barrier.max.width + sizeOffset);
			let height = utils.random(config.barrier.min.height + sizeOffset / 2, config.barrier.max.height + sizeOffset);
			let newBarrier = Barrier.create({
				position: pos,
				width: width + minSpacing,
				height: height + minSpacing
			});

			//Don't let the new barrier spawn on top of other barriers
			for (var j = 0; j < this.barriers.length; j++) {
				let otherBarrier = this.barriers[j];
				if (shape.SAT(newBarrier.shape, otherBarrier.shape)) {
					pos = this.getRandomPosition();
					width = utils.random(config.barrier.min.width + sizeOffset / 2, config.barrier.max.width + sizeOffset);
					height = utils.random(config.barrier.min.height + sizeOffset / 2, config.barrier.max.height + sizeOffset);
					newBarrier = Barrier.create({
						position: pos,
						width: width + minSpacing,
						height: height + minSpacing
					});

					//Safety leverage in case the new barrier gets stuck at finding its own position
					if (Date.now() - addBarrierStart > 2000) break;

					j = -1;
				}
			}

			this.barriers.push(Barrier.create({
				position: newBarrier.position,
				width: newBarrier.width - minSpacing,
				height: newBarrier.height - minSpacing
			}));
		}

		//Add random zombies
		for(var i = 0; i < 100; i++){
			this.addZombie();
		}
	}

	update() {
		//Add players to quadtree
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			player.addToQuadtree(this.quadtree);
		}

		//Add zombies to quadtree
		for (var i = 0; i < this.zombies.length; i++) {
			let zombie = this.zombies[i];
			zombie.addToQuadtree(this.quadtree);
		}

		//Add bullets to quadtree
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			bullet.addToQuadtree(this.quadtree);
		}

		//Add barriers to quadtree
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			barrier.addToQuadtree(this.quadtree);
		}

		//Update players
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			player.update(this);
		}

		//Update zombies
		for (var i = 0; i < this.zombies.length; i++) {
			let zombie = this.zombies[i];
			zombie.update(this);
		}

		//Update bullets
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			bullet.update(this);
		}

		this.quadtree.clear();
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

		//Don't let the player spawn inside a barrier
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			if (shape.SAT(player.shape, barrier.shape)) {
				player = Player.create(id, {
					position: this.getRandomPosition(),
					radius: config.player.radius
				});

				i = -1;
			}
		}

		this.players.push(player);
		return player;
	}

	removePlayer(id) {
		let player = this.getPlayer(id);
		if (player) {
			this.players.splice(this.players.indexOf(player), 1);
		}
	}

	getZombie(id) {
		let zombie = this.zombies.find(z => z.id === id);
		return zombie;
	}

	addZombie() {
		let zombie = Zombie.create({
			position: this.getRandomPosition(),
			radius: config.zombie.radius
		});

		//Don't let the zombie spawn inside a barrier
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			if (shape.SAT(zombie.shape, barrier.shape)) {
				zombie = Zombie.create({
					position: this.getRandomPosition(),
					radius: config.zombie.radius
				});

				i = -1;
			}
		}

		this.zombies.push(zombie);
		return zombie;
	}

	removeZombie(id) {
		let zombie = this.getZombie(id);
		if (zombie) {
			this.zombies.splice(this.zombies.indexOf(zombie), 1);
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