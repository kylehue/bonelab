class Room {
	constructor(name) {
		this.name = name;
		this.players = [];
		this.wave = 1;
		this.maxWave = 50;
		this.description = "Test";
		this.number = 1;
	}

	addPlayer(id) {
		this.players.push({
			id: id
		});
	}

	removePlayer(id) {
		let player = this.players.find(player => player.id === id);
		this.players.splice(this.players.indexOf(player), 1);
	}
}

module.exports = {
	create: function (name) {
		return new Room(name);
	}
};