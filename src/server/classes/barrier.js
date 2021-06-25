const uuid = require("uuid");
const config = require("../../../lib/config.js");
const vector = require("../../../lib/vector.js");

const Matter = require("matter-js");
const Body = Matter.Body;
class Barrier {
	constructor(body) {
		this.body = body;
		this.id = uuid.v4();
		this.position = vector(this.body.position);
		this.width = Math.abs(this.body.bounds.max.x - this.body.bounds.min.x);
		this.height = Math.abs(this.body.bounds.max.y - this.body.bounds.min.y);
		this.angle = this.body.angle;

		this.vertices = [];
		for(var i = 0; i < this.body.vertices.length; i++){
			let vertex = this.body.vertices[i];
			this.vertices.push(vector(vertex));
		}

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
	create: function(body) {
		return new Barrier(body);
	}
}