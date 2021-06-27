const renderer = require("../lib/renderer.js");
const config = require("../../../lib/config.js");
const vector = require("../../../lib/vector.js");
const shape = require("../../../lib/shape.js");
const mouse = require("../../../lib/mouse.js");
const key = require("../../../lib/key.js");
const utils = require("../../../lib/utils.js");
const client = require("./client.js");
const vue = require("./vue/vue.js");
const Room = require("./classes/room.js");
window.client = client;

let room = null;

client.socket.on("client:room:enter", serverRoom => {
	//Create the client's room
	room = Room.create(serverRoom.id, {
		index: serverRoom.index,
		description: serverRoom.description,
		password: serverRoom.password,
		maxWave: serverRoom.maxWave,
		currentWave: serverRoom.currentWave,
		size: serverRoom.size,
		wallWidth: serverRoom.wallWidth,
		background: serverRoom.background
	});
});

client.socket.on("client:room:update", serverRoom => {
	//Adding / Updating players

	let serverPlayers = serverRoom.players;
	for (var i = 0; i < serverPlayers.length; i++) {
		let serverPlayer = serverPlayers[i];
		//Check if the server player already exists in the client's room
		let clientPlayer = room.getPlayer(serverPlayer.id);
		if (clientPlayer) {
			//If it exists, just update it
			clientPlayer.serverPosition.set(serverPlayer.position);
			clientPlayer.mouse.set(serverPlayer.mouse);

			let newAngle = clientPlayer.mouse.heading(clientPlayer.position);
			clientPlayer.angle = newAngle;
			clientPlayer.radius = serverPlayer.radius;
		} else {
			//If it doesn't exist, add it in the client's room
			room.addPlayer(serverPlayer.id, {
				position: vector(serverPlayer.position),
				mouse: vector(serverPlayer.mouse),
				radius: serverPlayer.radius
			});
		}
	}

	//Deleting players

	//Loop through client players
	for (var i = 0; i < room.players.length; i++) {
		let clientPlayer = room.players[i];
		//Check if a client player exists in the server players
		let player = serverPlayers.find(p => p.id === clientPlayer.id);
		if (!player) {
			//If not, remove the player in the room
			room.removePlayer(clientPlayer.id);
		}
	}

	//Adding / Updating zombies

	let serverZombies = serverRoom.zombies;
	for (var i = 0; i < serverZombies.length; i++) {
		let serverZombie = serverZombies[i];
		//Check if the server zombie already exists in the client's room
		let clientZombie = room.getZombie(serverZombie.id);
		if (clientZombie) {
			//If it exists, just update it
			clientZombie.serverPosition.set(serverZombie.position);
			clientZombie.radius = serverZombie.radius;
			clientZombie.angle = serverZombie.angle;
		} else {
			//If it doesn't exist, add it in the client's room
			room.addZombie(serverZombie.id, {
				position: vector(serverZombie.position),
				radius: serverZombie.radius,
				angle: serverZombie.angle
			});
		}
	}

	//Deleting zombies

	//Loop through client zombies
	for (var i = 0; i < room.zombies.length; i++) {
		let clientZombie = room.zombies[i];
		//Check if a client zombie exists in the server zombies
		let zombie = serverZombies.find(z => z.id === clientZombie.id);
		if (!zombie) {
			//If not, remove the zombie in the room
			room.removeZombie(clientZombie.id);
		}
	}

	//Adding / Updating bullets

	let serverBullets = serverRoom.bullets;
	for (var i = 0; i < serverBullets.length; i++) {
		let serverBullet = serverBullets[i];
		//Check if the server bullet already exists in the client's room
		let clientBullet = room.getBullet(serverBullet.id);
		if (clientBullet) {
			//If it exists, just update it
			clientBullet.serverPosition.set(serverBullet.position);
		} else {
			//If it doesn't exist, add it in the client's room
			let playerPosition = room.getPlayer(serverBullet.playerId).position.copy();
			room.addBullet(serverBullet.id, {
				playerId: serverBullet.playerId,
				position: vector({
					x: playerPosition.x + Math.cos(serverBullet.angle + 0.17) * 22,
					y: playerPosition.y + Math.sin(serverBullet.angle + 0.17) * 22
				}),
				radius: serverBullet.radius,
				angle: serverBullet.angle
			});
		}
	}

	//Deleting bullets

	//Loop through client bullets
	for (var i = 0; i < room.bullets.length; i++) {
		let clientBullet = room.bullets[i];
		//Check if a client bullet exists in the server bullets
		let bullet = serverBullets.find(p => p.id === clientBullet.id);
		if (!bullet) {
			//If not, remove the bullet in the room
			room.removeBullet(clientBullet.id);
		}
	}

	//Adding / Updating barriers

	let serverBarriers = serverRoom.barriers;
	for (var i = 0; i < serverBarriers.length; i++) {
		let serverBarrier = serverBarriers[i];
		//Check if the server barrier already exists in the client's room
		let clientBarrier = room.getBarrier(serverBarrier.id);
		if (clientBarrier) {
			//If it exists, just update it
			
		} else {
			//If it doesn't exist, add it in the client's room
			room.addBarrier(serverBarrier.id, {
				position: vector(serverBarrier.position),
				width: serverBarrier.width,
				height: serverBarrier.height,
				angle: serverBarrier.angle,
				vertices: serverBarrier.vertices
			});
		}
	}
});

renderer.fullscreen();
renderer.render(function() {
	if (room) {
		let wm = renderer.camera.screenToWorld(mouse.x, mouse.y);
		client.setMouse(wm.x, wm.y);

		if (key.check(config.player.controls.moveUp)) {
			client.moveUp();
		}
		if (key.check(config.player.controls.moveRight)) {
			client.moveRight();
		}
		if (key.check(config.player.controls.moveDown)) {
			client.moveDown();
		}
		if (key.check(config.player.controls.moveLeft)) {
			client.moveLeft();
		}
		if (mouse.pressed) {
			client.shoot();
		}
	}

	renderer.camera.begin(function() {
		if (room) {
			if (room.localPlayer) {
				renderer.camera.moveTo(room.localPlayer.position.x, room.localPlayer.position.y);
				renderer.camera.zoomTo(config.player.zoom);
			}
			room.render(renderer);
			room.update();
		}
	})
});

key.on("keydown", function() {
	if (key.code == 16) {
		console.log(renderer.getFrameRate());
		console.log(room);
	}
})