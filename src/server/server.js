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

io.on("connection", socket => {
	console.log(`${socket.id} has connected.`);

	socket.on("client:create:room", (id, roomName) => {
		game.createRoom(roomName);
	});

	socket.on("client:join", (id, roomName) => {

	});

	socket.on("client:leave", (id, roomName) => {

	});
});