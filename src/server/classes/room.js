const uuid = require("uuid");
const Player = require("./player.js");

class Room {
	constructor(options) {
		options = options || {};
		this.id = uuid.v4();
		this.index = options.index || -1;
		this.description = options.description || "";
		this.password = options.password || "";
		this.maxWave = options.maxWave || 0;
		this.currentWave = 1;
		this.players = [];
	}

	addPlayer(id) {
		let player = Player.create(id);
		this.players.push(player);
		return player;
	}

	removePlayer(id) {
		let player = this.players.find(p => p.id === id);
		if (player) {
			this.players.splice(this.players.indexOf(player), 1);
		}
	}
}

module.exports = {
	create: function(options) {
		return new Room(options);
	}
};