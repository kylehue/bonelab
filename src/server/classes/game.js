const Room = require("./room.js");

class Game {
	constructor() {
		this.rooms = [];
	}

	createRoom(name) {
		let room = Room.create(name);
		this.rooms.push(room);
	}
}

module.exports = new Game();