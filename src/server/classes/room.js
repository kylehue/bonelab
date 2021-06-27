/*Necessities*/
const uuid = require("uuid");
const config = require("../../../lib/config.js");
const vector = require("../../../lib/vector.js");
const utils = require("../../../lib/utils.js");
const shape = require("../../../lib/shape.js");

/*Objects*/
const Quadtree = require('@timohausmann/quadtree-js');
const Player = require("./player.js");
const Zombie = require("./zombie.js");
const Bullet = require("./bullet.js");
const Barrier = require("./barrier.js");

/*Matter.js*/
const Matter = require("matter-js");
const World = Matter.World;
const Engine = Matter.Engine;
const Bodies = Matter.Bodies;

const SAT = Matter.SAT;

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
		this.wallWidth = config.map.wallWidth;
		this.background = config.map.background || "#000";

		//Objects
		this.quadtree = new Quadtree({
			x: -this.size / 2,
			y: -this.size / 2,
			width: this.size,
			height: this.size
		});

		this.engine = Engine.create();
		this.world = this.engine.world;
		this.world.gravity.scale = 0;

		this.players = [];
		this.zombies = [];
		this.bullets = [];
		this.barriers = [];

		//Add walls
		this.addBarrier(0, -this.size / 2 + this.wallWidth / 2, this.size, this.wallWidth);
		this.addBarrier(this.size / 2 - this.wallWidth / 2, 0, this.wallWidth, this.size);
		this.addBarrier(0, this.size / 2 - this.wallWidth / 2, this.size, this.wallWidth);
		this.addBarrier(-this.size / 2 + this.wallWidth / 2, 0, this.wallWidth, this.size);

		//Add random barriers
		let sizeOffset = Math.pow(this.size, 0.6);
		let addBarrierStart = Date.now();
		for (var i = 0; i < this.size * 0.02; i++) {
			let position = this.getRandomPosition();
			let width = utils.random(config.barrier.min.width + sizeOffset / 2, config.barrier.max.width + sizeOffset);
			let height = utils.random(config.barrier.min.height + sizeOffset / 2, config.barrier.max.height + sizeOffset);
			let angle = utils.random(-Math.PI * 0.25, Math.PI * 0.25);

			this.barriers.sort((a, b) => {
				return position.dist(b.position) - position.dist(a.position);
			});

			let closestBarrier = this.barriers[0];
			if (closestBarrier) {
				angle = closestBarrier.angle + Math.PI * 0.25;
			}

			let body = Bodies.rectangle(position.x, position.y, width, height, {
				angle: angle
			});

			for (var j = 0; j < this.barriers.length; j++) {
				let otherBarrier = this.barriers[j];
				if (SAT.collides(body, otherBarrier.body).collided) {
					position = this.getRandomPosition();
					width = utils.random(config.barrier.min.width + sizeOffset / 2, config.barrier.max.width + sizeOffset);
					height = utils.random(config.barrier.min.height + sizeOffset / 2, config.barrier.max.height + sizeOffset);

					this.barriers.sort((a, b) => {
						return position.dist(b.position) - position.dist(a.position);
					});

					closestBarrier = this.barriers[0];
					if (closestBarrier) {
						angle = closestBarrier.angle + Math.PI * 0.25;
					}

					body = Bodies.rectangle(position.x, position.y, width, height, {
						angle: angle
					});

					j = -1;
				}
			}


			this.addBarrier(position.x, position.y, width, height, {
				angle: angle
			}, true);

		}

		//Add random zombies
		for (var i = 0; i < 100; i++) {
			this.addZombie();
		}
	}

	update() {
		Engine.update(this.engine);

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

		//Update barriers
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			barrier.update(this);
		}

		this.quadtree.clear();
	}

	getPlayer(id) {
		let player = this.players.find(p => p.id === id);
		return player;
	}

	addPlayer(id) {
		let position = this.getRandomPosition();
		let radius = config.player.radius;
		let options = config.player.body;
		let body = Bodies.circle(position.x, position.y, radius, options);

		let player = Player.create(id, body);

		//Don't let the player spawn inside a barrier
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			if (SAT.collides(body, barrier.body).collided) {
				position = this.getRandomPosition();
				radius = config.player.radius;
				options = config.player.body;
				body = Bodies.circle(position.x, position.y, radius, options);

				player = Player.create(id, body);

				i = -1;
			}
		}

		World.add(this.world, body);
		this.players.push(player);
		return player;
	}

	removePlayer(id) {
		let player = this.getPlayer(id);
		if (player) {
			World.remove(this.world, player.body);
			this.players.splice(this.players.indexOf(player), 1);
		}
	}

	getZombie(id) {
		let zombie = this.zombies.find(z => z.id === id);
		return zombie;
	}

	addZombie() {
		let position = this.getRandomPosition();
		let radius = config.zombie.radius;
		let options = config.zombie.body;
		let body = Bodies.circle(position.x, position.y, radius, options);

		let zombie = Zombie.create(body);

		//Don't let the zombie spawn inside a barrier
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			if (SAT.collides(body, barrier.body).collided) {
				position = this.getRandomPosition();
				radius = config.zombie.radius;
				options = config.zombie.body;
				body = Bodies.circle(position.x, position.y, radius, options);

				zombie = Zombie.create(body);

				i = -1;
			}
		}

		World.add(this.world, body);
		this.zombies.push(zombie);
		return zombie;
	}

	removeZombie(id) {
		let zombie = this.getZombie(id);
		if (zombie) {
			World.remove(this.world, zombie.body);
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

	addBarrier(x, y, width, height, options, mergeOptions) {
		if (mergeOptions) {
			options = {...config.barrier.body,
				...options
			};
		} else {
			options = options || config.barrier.body;
		}
		let body = Bodies.rectangle(x, y, width, height, options);
		let barrier = Barrier.create(body);
		World.add(this.world, body);
		this.barriers.push(barrier);
		return barrier;
	}

	removeBarrier(id) {
		let barrier = this.getBarrier(id);
		if (barrier) {
			World.remove(this.world, barrier.body);
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