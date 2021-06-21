const Room = require("./room.js");

class Game {
	constructor() {
		this.rooms = [];
	}

	createRoom(description, waves, password) {
		let room = Room.create(this.rooms.length + 1, description, waves, password);
		this.rooms.push(room);
		return room;
	}

	getRoom(id) {
		let room = this.rooms.find(rm => rm.id == id);
		return room;
	}
}

module.exports = new Game();