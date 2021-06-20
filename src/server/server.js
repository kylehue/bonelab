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
const database = require("./database.js");

//Handle game
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

io.on("connection", socket => {
	console.log(`${socket.id} has connected.`);

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

	socket.on("client:create:room", (id, roomName) => {
		if (eventLogs) console.log(`${id} created a room named ${roomName}`);
		game.createRoom(roomName);
	});

	socket.on("client:join", (id, roomName) => {

	});

	socket.on("client:leave", (id, roomName) => {

	});
});