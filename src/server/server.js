//Setup server
const express = require("express");
const socket = require("socket.io");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
const io = socket(server);
app.use(express.static(__dirname + "/../client"));

//
const database = require("./database.js");

//Handle game
const config = require("../../lib/config.js");
const game = require("./classes/game.js");
let eventLogs = true;

function toggleOffline(id, value) {
	database.in("users").update({
		_id: id
	}, {
		$set: {
			offline: value
		}
	});
}

function parseRoom(room, options) {
	options = options || {};
	let parsedRoom = {
		id: room.id,
		index: room.index,
		description: room.description,
		password: room.password,
		maxWave: room.maxWave,
		currentWave: room.currentWave,
		size: room.size,
		background: room.background,
		playerCount: room.players.length
	};

	if (options.players || options.objects) {
		let players = [];
		for (var j = 0; j < room.players.length; j++) {
			let player = room.players[j];
			players.push({
				id: player.id,
				mouse: player.mouse,
				position: player.position,
				radius: player.radius,
				angle: player.angle
			});
		}

		parsedRoom.players = players;
	}

	if (options.zombies || options.objects) {
		let zombies = [];
		for (var j = 0; j < room.zombies.length; j++) {
			let zombie = room.zombies[j];
			zombies.push({
				id: zombie.id,
				position: zombie.position,
				radius: zombie.radius,
				angle: zombie.angle
			});
		}

		parsedRoom.zombies = zombies;
	}

	if (options.bullets || options.objects) {
		let bullets = [];
		for (var j = 0; j < room.bullets.length; j++) {
			let bullet = room.bullets[j];
			bullets.push({
				id: bullet.id,
				playerId: bullet.playerId,
				position: bullet.position,
				radius: bullet.radius
			});
		}

		parsedRoom.bullets = bullets;
	}

	if (options.barriers || options.objects) {
		let barriers = [];
		for (var j = 0; j < room.barriers.length; j++) {
			let barrier = room.barriers[j];
			barriers.push({
				id: barrier.id,
				position: barrier.position,
				width: barrier.width,
				height: barrier.height,
				angle: barrier.angle,
				vertices: barrier.vertices
			});
		}

		parsedRoom.barriers = barriers;
	}

	return parsedRoom;
}

function updateLobbyRooms() {
	for (var i = 0; i < game.rooms.length; i++) {
		let room = game.rooms[i];
		io.emit("client:lobby:room:update", parseRoom(room, {
			players: true
		}));
	}
}

io.on("connection", socket => {
	if (eventLogs) console.log(`${socket.id} has connected`);

	socket.on("disconnect", () => {
		if (eventLogs) console.log(`${socket.id} has disconnected`);
		game.removePlayer(socket.id);
		updateLobbyRooms();

		//Delete empty rooms
		for (let room of game.rooms) {
			if (!room.players.length) {
				game.removeRoom(room.id);
				io.emit("room:delete", room.id);
			}
		}
	});

	socket.on("client:codename:validate", codename => {
		database.in("users").find({
			codename: codename
		}, function(er, result) {
			if (result.length) {
				socket.emit("client:codename:error", "duplicate");
			} else {
				socket.emit("client:codename:success", codename);
			}
		});
	});

	socket.on("client:codename", (id, codename) => {
		database.in("users").update({
			_id: id
		}, {
			$set: {
				codename: codename
			}
		});
	});

	socket.on("client:message:lobby", (name, message) => {
		if (eventLogs) console.log(`${name} sent ${message}`);
		io.emit("message:lobby", name, message);
	});

	socket.on("client:register", (username, password) => {
		if (eventLogs) console.log(`${username} has registered`);
		database.in("users").insert({
			username: username,
			codename: "",
			password: password,
			offline: true,
			friends: [],
			level: 1,
			experience: 0,
			currency: 1000,
			inventory: {
				guns: [],
				wardrobe: {
					heads: [],
					bodies: []
				}
			},
			registrationDate: Date.now()
		});
	});

	socket.on("client:logout", id => {
		if (eventLogs) console.log(`${id} has logged out`);
		toggleOffline(id, true);
	});

	socket.on("client:login", id => {
		if (eventLogs) console.log(`${id} has logged in`);
		database.in("users").find({
			_id: id
		}, function(er, result) {
			if (result.length) {
				let data = result[0];
				let loadData = {
					id: id,
					codename: data.codename,
					inventory: data.inventory,
					currency: data.currency,
					level: data.level,
					experience: data.experience,
					friends: data.friends,
					offline: false
				};

				socket.emit("client:load", loadData);
				updateLobbyRooms();
				toggleOffline(id, false);
			}
		});
	});

	socket.on("client:register:validate", (username, password) => {
		if (eventLogs) console.log(`${username} tried to register`);
		database.in("users").find({
			username: username
		}, function(er, result) {
			if (result.length) {
				socket.emit("client:register:error", "duplicate");
			} else {
				socket.emit("client:register:success", username, password);
			}
		});
	});

	socket.on("client:login:validate", (username, password) => {
		if (eventLogs) console.log(`${username} tried to login`);
		database.in("users").find({
			username: username
		}, function(er, result) {
			if (result.length) {
				if (result[0].password !== password) {
					socket.emit("client:login:error", "incorrect");
				} else {
					socket.emit("client:login:success", result[0]._id);
				}
			} else {
				socket.emit("client:login:error", "unknown");
			}
		});
	});

	socket.on("client:room:join", roomId => {
		let room = game.getRoom(roomId);
		let player = room.addPlayer(socket.id);
		socket.join(roomId);
		let parsedRoom = parseRoom(room, {
			players: true
		});
		let parsedPlayer = parsedRoom.players.find(p => p.id === player.id);
		socket.emit("client:room:enter", parsedRoom);
		io.in(room.id).emit("client:player:add", parsedPlayer);
		updateLobbyRooms();
	});

	socket.on("client:room:leave", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			room.removePlayer(socket.id);
		} else {
			if (eventLogs) console.log("Removing a player has failed")
		}
	});

	socket.on("client:create:room", (description, waves, password) => {
		let room = game.createRoom({
			description: description,
			maxWave: waves,
			password: password
		});

		socket.emit("client:join", room.id);
		updateLobbyRooms();
	});

	socket.on("client:game:mouse", (roomId, x, y) => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.setMouse(x, y);
			}
		}
	});

	socket.on("client:game:move:up", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.moveUp();
			}
		}
	});

	socket.on("client:game:move:right", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.moveRight();
			}
		}
	});

	socket.on("client:game:move:down", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.moveDown();
			}
		}
	});

	socket.on("client:game:move:left", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.moveLeft();
			}
		}
	});

	socket.on("client:game:position", (roomId, x, y) => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.position.set(x, y);
			}
		}
	});

	socket.on("client:game:shoot", roomId => {
		let room = game.getRoom(roomId);
		if (room) {
			let player = room.getPlayer(socket.id);
			if (player) {
				player.shoot(room);
			}
		}
	});
});

function updateClient() {
	for (var i = 0; i < game.rooms.length; i++) {
		let room = game.rooms[i];
		io.in(room.id).emit("client:room:update", parseRoom(room, {
			objects: true
		}));
	}
}

function updateGame() {
	for (var i = 0; i < game.rooms.length; i++) {
		let room = game.rooms[i];
		room.update();
	}
}

setInterval(updateClient, 1000 / 30);
setInterval(updateGame, 1000 / 30);