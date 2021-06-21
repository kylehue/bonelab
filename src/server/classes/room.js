const uuid = require("uuid");
const Player = require("./player.js");

class Room {
	constructor(index, description, waves, password) {
		this.id = uuid.v4();
		this.index = index;
		this.description = description;
		this.currentWave = 1;
		this.password = password;
		this.players = [];
		this.maxWave = waves;
	}

	addPlayer(id) {
		let player = Player.create(id);
		this.players.push(player);
		return player;
	}

	removePlayer(id) {
		let player = this.players.find(player => player.id === id);
		this.players.splice(this.players.indexOf(player), 1);
	}
}

module.exports = {
	create: function (index, description, waves, password) {
		return new Room(index, description, waves, password);
	}
};