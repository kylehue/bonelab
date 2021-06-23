const shape = require("../../../../lib/shape.js");

class Barrier {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.width = options.width;
		this.height = options.height;
		this.shape = shape.rect(this.position.x, this.position.y, this.width, this.height);
	}

	render(renderer) {
		renderer.fromVertices(this.shape.vertices, {
			fill: "#222"
		});
	}

	update() {
		
	}
}

module.exports = {
	create: function (id, options) {
		return new Barrier(id, options);
	}
}