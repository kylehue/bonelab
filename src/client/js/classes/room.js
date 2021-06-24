const client = require("./../client.js");
const vector = require("../../../../lib/vector.js");
const config = require("../../../../lib/config.js");
const utils = require("../../../../lib/utils.js");
const Ray = require("../../../../lib/ray.js");
const Player = require("./player.js");
const Zombie = require("./zombie.js");
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
		this.shadowColor = "#28262a";

		//Objects
		this.localPlayer = null;
		this.players = [];
		this.zombies = [];
		this.bullets = [];
		this.barriers = [];
		this.sight = Ray.create();
	}

	render(renderer) {
		//Draw the background
		renderer.rect(-this.size / 2, -this.size / 2, this.size, this.size, {
			fill: this.shadowColor
		});

		//Draw the barriers
		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			if (renderer.camera.sees(barrier.position.x, barrier.position.y, barrier.width, barrier.height)) barrier.render(renderer);
		}

		let sight = this.sight.getShape();
		for(var i = 0; i < sight.length; i++){
			let castA = sight[i];
			for(var j = 0; j < sight.length; j++){
				let castB = sight[j];
				if (castA === castB) continue;
				let offset = 1;
				if (castA.x >= castB.x - offset && castA.x <= castB.x + offset && castA.y >= castB.y - offset && castA.y <= castB.y + offset) {
					sight.splice(i, 1);
					break;
				}
			}
		}

		renderer.save();

		//Draw the line of sight
		renderer.fromVertices(sight, {
			fill: this.background
		});

		renderer.clip();

		//Draw the players
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			if (renderer.camera.sees(player.position.x, player.position.y, player.radius, player.radius)) player.render(renderer);
		}

		//Draw the zombies
		for (var i = 0; i < this.zombies.length; i++) {
			let zombie = this.zombies[i];
			if (renderer.camera.sees(zombie.position.x, zombie.position.y, zombie.radius, zombie.radius)) zombie.render(renderer);
		}

		//Draw the bullets
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			if (renderer.camera.sees(bullet.position.x, bullet.position.y, bullet.radius, bullet.radius)) bullet.render(renderer);
		}

		renderer.restore();
	}

	update() {
		//Update the players
		for (var i = 0; i < this.players.length; i++) {
			let player = this.players[i];
			player.update();
		}

		//Update the zombies
		for (var i = 0; i < this.zombies.length; i++) {
			let zombie = this.zombies[i];
			zombie.update();
		}

		//Update the bullets
		for (var i = 0; i < this.bullets.length; i++) {
			let bullet = this.bullets[i];
			bullet.update();
		}

		if (this.localPlayer) {
			this.sight.position.x = this.localPlayer.position.x;
			this.sight.position.y = this.localPlayer.position.y;
			this.sight.cast();
		}
	}

	getPlayer(id) {
		let player = this.players.find(p => p.id === id) || null;
		return player;
	}

	addPlayer(id, options) {
		let player = Player.create(id, options);
		this.players.push(player);
		if (id === client.socket.id) {
			this.localPlayer = player;
		}
		return player;
	}

	removePlayer(id) {
		let player = this.getPlayer(id);
		if (player) {
			this.players.splice(this.players.indexOf(player), 1);
		}
	}

	getZombie(id) {
		let zombie = this.zombies.find(z => z.id === id) || null;
		return zombie;
	}

	addZombie(id, options) {
		let zombie = Zombie.create(id, options);
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

		for (var i = 0; i < barrier.shape.vertices.length; i++) {
			let vertex = barrier.shape.vertices[i];
			let nextVertex = barrier.shape.vertices[i + 1 == barrier.shape.vertices.length ? 0 : i + 1];
			this.sight.addBarrier(vertex.x, vertex.y, nextVertex.x, nextVertex.y);
		}

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
	create: function(id, options) {
		return new Room(id, options);
	}
};