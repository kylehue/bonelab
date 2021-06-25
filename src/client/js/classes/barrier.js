class Barrier {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.width = options.width;
		this.height = options.height;
		this.angle = options.angle;
		
		this.vertices = options.vertices;
	}

	render(renderer) {
		renderer.fromVertices(this.vertices, {
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