class Bullet {
	constructor(id, options) {
		this.id = id;
		this.playerId = options.playerId;
		this.position = options.position;
		this.serverPosition = this.position.copy();
		this.radius = options.radius;
	}

	render(renderer) {
		renderer.circle(this.position.x, this.position.y, this.radius, {
			fill: "red"
		});
	}

	update() {
		this.position.lerp(this.serverPosition, 0.2);
	}
}

module.exports = {
	create: function (id, options) {
		return new Bullet(id, options);
	}
}