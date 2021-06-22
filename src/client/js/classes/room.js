const client = require("./../client.js");

class Room {
	constructor() {
		this.players = [];
	}

	render(renderer) {

	}
}

client.socket.on("client:room:enter", room => {
	console.log(room);
})

const room = new Room();

module.exports = room;