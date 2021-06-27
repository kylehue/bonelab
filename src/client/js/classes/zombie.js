const shape = require("../../../../lib/shape.js");

const zombieImg = new Image();
zombieImg.src = "assets/images/zombie.png";
class Zombie {
	constructor(id, options) {
		this.id = id;
		this.position = options.position;
		this.serverPosition = this.position.copy();
		this.radius = options.radius;
		this.angle = options.angle;
		this.shape = shape.polygon(this.position.x, this.position.y, this.radius, 16);
		//this.shape.scale(2, 1);
	}

	render(renderer) {
		renderer.save();
		renderer.context.translate(this.position.x, this.position.y);
		renderer.context.rotate(this.position.heading(this.serverPosition));
		let size = this.radius * 0.024;
		renderer.context.scale(size, size);
		renderer.context.drawImage(zombieImg, -zombieImg.width / 2 + 15, -zombieImg.height / 2);
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
		return new Zombie(id, options);
	}
}