const Room = require("./room.js");

class Game {
	constructor() {
		this.rooms = [];
	}

	createRoom(options) {
		let room = Room.create({
			index: this.rooms.length + 1,
			description: options.description, 
			maxWave: options.maxWave, 
			password: options.password
		});
		
		this.rooms.push(room);
		return room;
	}

	removeRoom(roomId) {
		let room = this.getRoom(roomId);
		if (room) {
			this.rooms.splice(this.rooms.indexOf(room), 1);
		}
	}

	getRoom(id) {
		let room = this.rooms.find(rm => rm.id == id);
		return room;
	}

	removePlayer(id) {
		for (let room of this.rooms) {
			room.removePlayer(id);
		}
	}
}

const game = new Game();

module.exports = game;