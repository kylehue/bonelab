const shape = require("../../../../lib/shape.js");

class Player {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.serverPosition = this.position.copy();
		this.radius = options.radius;
		this.mouse = options.mouse;
		this.angle = 0;
		this.shape = shape.polygon(this.position.x, this.position.y, this.radius, 3);
		this.shape.scale(2, 1);
	}

	render(renderer) {
		this.shape.translate(this.position.x, this.position.y);
		this.shape.rotate(this.angle);
		renderer.fromVertices(this.shape.vertices, {
			fill: "white"
		});

		/*renderer.circle(this.position.x, this.position.y, this.radius, {
			fill: "white"
		});*/
	}

	update() {
		this.position.lerp(this.serverPosition, 0.1);
	}
}

module.exports = {
	create: function (id, options) {
		return new Player(id, options);
	}
}