const shape = require("../../../../lib/shape.js");
const playerImg = new Image();
playerImg.src = "assets/images/player/player.png";
class Player {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.serverPosition = this.position.copy();
		this.radius = options.radius;
		this.mouse = options.mouse;
		this.angle = 0;
		this.shape = shape.polygon(this.position.x, this.position.y, this.radius, 16);
		//this.shape.scale(2, 1);
	}

	render(renderer) {
		renderer.save();
		renderer.context.translate(this.position.x, this.position.y);
		renderer.context.rotate(this.angle + Math.PI);
		let size = this.radius * 0.03;
		renderer.context.scale(size, size);
		renderer.context.drawImage(playerImg, -playerImg.width / 2 + 15, -playerImg.height / 2);
		renderer.restore();

		/*renderer.circle(this.position.x, this.position.y, this.radius, {
			fill: "white"
		});*/
	}

	update() {
		this.position.lerp(this.serverPosition, 0.2);
	}
}

module.exports = {
	create: function (id, options) {
		return new Player(id, options);
	}
}