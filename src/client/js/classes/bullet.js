const vector = require("../../../../lib/vector.js");
const bulletImg = new Image();
bulletImg.src = "assets/images/player/bullet.png";
class Bullet {
	constructor(id, options) {
		this.id = id;
		this.playerId = options.playerId;
		this.angle = options.angle;
		this.position = options.position;
		this.serverPosition = this.position.copy();
		this.radius = options.radius;
	}

	render(renderer) {
		renderer.save();
		renderer.context.translate(this.position.x, this.position.y);
		renderer.context.rotate(this.angle);
		let size = this.radius * 0.1;
		renderer.context.scale(size, size);
		renderer.context.drawImage(bulletImg, -bulletImg.width / 2, -bulletImg.height / 2);
		renderer.restore();
		/*renderer.circle(this.position.x, this.position.y, this.radius, {
			fill: "red"
		});*/
	}

	update() {
		this.position.lerp(this.serverPosition, 0.3);
	}
}

module.exports = {
	create: function (id, options) {
		return new Bullet(id, options);
	}
}