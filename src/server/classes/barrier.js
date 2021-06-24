const uuid = require("uuid");
const config = require("../../../lib/config.js");
const shape = require("../../../lib/shape.js");

class Barrier {
	constructor(options) {
		this.id = uuid.v4();
		this.position = options.position;
		this.width = options.width;
		this.height = options.height;
		this.shape = shape.rect(this.position.x, this.position.y, this.width, this.height);

		this.label = "barrier";
	}

	addToQuadtree(quadtree) {
		quadtree.insert({
			x: this.position.x - this.width / 2,
			y: this.position.y - this.height / 2,
			width: this.width,
			height: this.height,
			self: this
		});
	}

	update(room) {
		
	}
}

module.exports = {
	create: function(options) {
		return new Barrier(options);
	}
}