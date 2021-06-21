const vector = require("../../../lib/vector.js");
const utils = require("../../../lib/utils.js");

class Player {
	constructor(id) {
		this.id = id;
		this.position = vector();
		this.radius = 10;
	}
}

module.exports = {
	create: function (id) {
		return new Player(id);
	}
}