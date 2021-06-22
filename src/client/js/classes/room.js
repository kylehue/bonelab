const client = require("./../client.js");

class Room {
	constructor() {
		this.players = [];
	}

	render(renderer) {

	}
}

client.socket.on("client:game", player => {
	console.log(player);
});

client.socket.on("client:game:update", room => {
	console.log(room);
});

const room = new Room();

module.exports = room;