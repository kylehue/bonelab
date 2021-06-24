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

function updateLobbyRooms() {
	for (var i = 0; i < game.rooms.length; i++) {
		io.emit("client:lobby:room:update", game.rooms[i]);
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
	})

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
		socket.emit("client:room:enter", room);
		io.in(room.id).emit("client:player:add", player);
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
		io.in(room.id).emit("client:room:update", room);
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