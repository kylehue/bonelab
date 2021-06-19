class Circle {
	constructor(x, y, radius) {
		this.position = {
			x: x,
			y: y
		};

		this.size = {
			x: 1,
			y: 1
		};

		this.bounds = {};

		this.radius = radius;
		this.angle = 0;
		this.vertices = [];
		this.sides = Math.ceil(Math.max(10, Math.min(24, this.radius)));

		this.updateVertices();
	}

	updateVertices(_sides) {
		let sides = _sides || this.sides;

		this.vertices = [];
		for (var angle = -Math.PI; angle < Math.PI; angle += Math.PI * 2 / sides) {
			let vertex = {
				x: this.position.x + Math.cos(angle) * this.radius,
				y: this.position.y + Math.sin(angle) * this.radius,
				angle: angle
			};

			this.vertices.push(vertex);
		}

		this.updateBounds();
	}

	updateBounds() {
		let x = [];
		let y = [];

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			x.push(vertex.x);
			y.push(vertex.y);
		}

		this.bounds = {
			min: {
				x: Math.min(...x),
				y: Math.min(...y)
			},
			max: {
				x: Math.max(...x),
				y: Math.max(...y)
			}
		}
	}

	setRadius(radius) {
		if (radius == this.radius) return;

		this.radius = radius;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			vertex.x = this.position.x + Math.cos(vertex.angle + this.angle) * this.radius;
			vertex.y = this.position.y + Math.sin(vertex.angle + this.angle) * this.radius;
		}

		this.updateBounds();
	}

	scale(x, y) {
		if (x == this.size.x && y == this.size.y) return;

		let sizeDelta = {
			x: x - this.size.x,
			y: y - this.size.y
		}

		this.size.x = x;
		this.size.y = y;

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let vertexDelta = {
				x: vertex.x - this.position.x,
				y: vertex.y - this.position.y
			};

			vertex.x = this.position.x + vertexDelta.x * (1 + sizeDelta.x);
			vertex.y = this.position.y + vertexDelta.y * (1 + sizeDelta.y);
		}

		this.updateBounds();
	}

	translate(x, y) {
		if (x == this.position.x && y == this.position.y) return;

		let delta = {
			x: x - this.position.x,
			y: y - this.position.y
		};

		this.position.x = x;
		this.position.y = y;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			vertex.x += delta.x;
			vertex.y += delta.y;
		}

		this.updateBounds();
	}

	rotate(angle) {
		if (angle == this.angle) return;

		let delta = angle - this.angle;

		this.angle = angle;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let x = (vertex.x - this.position.x) * Math.cos(delta) - (vertex.y - this.position.y) * Math.sin(delta);
			let y = (vertex.x - this.position.x) * Math.sin(delta) + (vertex.y - this.position.y) * Math.cos(delta);
			vertex.x = this.position.x + x;
			vertex.y = this.position.y + y;
		}

		this.updateBounds();
	}
}

class Rectangle {
	constructor(x, y, width, height) {
		this.position = {
			x: x,
			y: y
		};

		this.size = {
			x: 1,
			y: 1
		};

		this.bounds = {};

		this.angle = 0;
		this.vertices = [];

		this.updateVertices(width, height);
	}

	updateVertices(width, height) {
		this.vertices = [{
			x: this.position.x - width * 0.5,
			y: this.position.y - height * 0.5
		}, {
			x: this.position.x + width * 0.5,
			y: this.position.y - height * 0.5
		}, {
			x: this.position.x + width * 0.5,
			y: this.position.y + height * 0.5
		}, {
			x: this.position.x - width * 0.5,
			y: this.position.y + height * 0.5
		}];

		this.updateBounds();
	}

	updateBounds() {
		let x = [];
		let y = [];

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			x.push(vertex.x);
			y.push(vertex.y);
		}

		this.bounds = {
			min: {
				x: Math.min(...x),
				y: Math.min(...y)
			},
			max: {
				x: Math.max(...x),
				y: Math.max(...y)
			}
		}
	}

	scale(x, y) {
		if (x == this.size.x && y == this.size.y) return;

		let sizeDelta = {
			x: x - this.size.x,
			y: y - this.size.y
		}

		this.size.x = x;
		this.size.y = y;

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let vertexDelta = {
				x: vertex.x - this.position.x,
				y: vertex.y - this.position.y
			};

			vertex.x = this.position.x + vertexDelta.x * (1 + sizeDelta.x);
			vertex.y = this.position.y + vertexDelta.y * (1 + sizeDelta.y);
		}

		this.updateBounds();
	}

	translate(x, y) {
		if (x == this.position.x && y == this.position.y) return;

		let delta = {
			x: x - this.position.x,
			y: y - this.position.y
		};

		this.position.x = x;
		this.position.y = y;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			vertex.x += delta.x;
			vertex.y += delta.y;
		}

		this.updateBounds();
	}

	rotate(angle) {
		if (angle == this.angle) return;

		let delta = angle - this.angle;

		this.angle = angle;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let x = (vertex.x - this.position.x) * Math.cos(delta) - (vertex.y - this.position.y) * Math.sin(delta);
			let y = (vertex.x - this.position.x) * Math.sin(delta) + (vertex.y - this.position.y) * Math.cos(delta);
			vertex.x = this.position.x + x;
			vertex.y = this.position.y + y;
		}

		this.updateBounds();
	}
}

class Polygon {
	constructor(x, y, radius, sides) {
		this.position = {
			x: x,
			y: y
		};

		this.size = {
			x: 1,
			y: 1
		};

		this.bounds = {};

		this.radius = radius;
		this.angle = 0;
		this.vertices = [];
		this.sides = sides;

		this.updateVertices();
	}

	updateVertices(sides) {
		this.sides = sides ? sides : this.sides;

		this.vertices = [];
		for (var angle = -Math.PI; angle < Math.PI; angle += (Math.PI * 2) / this.sides) {
			let vertex = {
				x: this.position.x + Math.cos(angle) * this.radius,
				y: this.position.y + Math.sin(angle) * this.radius,
				angle: angle
			};

			this.vertices.push(vertex);
		}

		this.updateBounds();
	}

	updateBounds() {
		let x = [];
		let y = [];

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			x.push(vertex.x);
			y.push(vertex.y);
		}

		this.bounds = {
			min: {
				x: Math.min(...x),
				y: Math.min(...y)
			},
			max: {
				x: Math.max(...x),
				y: Math.max(...y)
			}
		}
	}

	setRadius(radius) {
		if (radius == this.radius) return;

		this.radius = radius;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			vertex.x = this.position.x + Math.cos(vertex.angle + this.angle) * this.radius;
			vertex.y = this.position.y + Math.sin(vertex.angle + this.angle) * this.radius;
		}

		this.updateBounds();
	}

	scale(x, y) {
		if (x == this.size.x && y == this.size.y) return;

		let sizeDelta = {
			x: x - this.size.x,
			y: y - this.size.y
		}

		this.size.x = x;
		this.size.y = y;

		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let vertexDelta = {
				x: vertex.x - this.position.x,
				y: vertex.y - this.position.y
			};

			vertex.x = this.position.x + vertexDelta.x * (1 + sizeDelta.x);
			vertex.y = this.position.y + vertexDelta.y * (1 + sizeDelta.y);
		}

		this.updateBounds();
	}

	translate(x, y) {
		if (x == this.position.x && y == this.position.y) return;

		let delta = {
			x: x - this.position.x,
			y: y - this.position.y
		};

		this.position.x = x;
		this.position.y = y;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			vertex.x += delta.x;
			vertex.y += delta.y;
		}

		this.updateBounds();
	}

	rotate(angle) {
		if (angle == this.angle) return;

		let delta = angle - this.angle;

		this.angle = angle;
		for (var i = 0; i < this.vertices.length; i++) {
			let vertex = this.vertices[i];
			let x = (vertex.x - this.position.x) * Math.cos(delta) - (vertex.y - this.position.y) * Math.sin(delta);
			let y = (vertex.x - this.position.x) * Math.sin(delta) + (vertex.y - this.position.y) * Math.cos(delta);
			vertex.x = this.position.x + x;
			vertex.y = this.position.y + y;
		}

		this.updateBounds();
	}
}

module.exports = {
	circle: function(x, y, radius) {
		x = x || 0;
		y = y || 0;
		radius = radius || 0;

		return new Circle(x, y, radius)
	},
	rect: function(x, y, width, height) {
		x = x || 0;
		y = y || 0;
		width = width || 0;
		height = height || 0;

		return new Rectangle(x, y, width, height);
	},
	polygon: function(x, y, radius, sides) {
		x = x || 0;
		y = y || 0;
		radius = radius || 0;
		sides = sides || 0;

		return new Polygon(x, y, radius, sides);
	},
	SAT: function(shapeA, shapeB) {
		const getAxes = function(vertices) {
			let axes = [];
			for (var i = 0; i < vertices.length; i++) {
				let currentVertex = vertices[i];
				let nextVertex = vertices[i + 1 == vertices.length ? 0 : i + 1];
				let axisNormal = {
					x: nextVertex.y - currentVertex.y,
					y: -(nextVertex.x - currentVertex.x)
				};

				axes.push(axisNormal);
			}

			return axes;
		}

		const getProjection = function(axis, vertices) {
			let min = Infinity;
			let max = -Infinity;

			for (var i = 0; i < this.vertices.length; i++) {
				let vertex = this.vertices[i];
				let projection = axis.x * vertex.x + axis.y * vertex.y;
				min = projection < min ? projection : min;
				max = projection > max ? projection : max;
			}

			return {
				min: min,
				max: max
			}
		}

		const getResult = function(verticesA, verticesB) {
			let axesA = getAxes(verticesA);
			let axesB = getAxes(verticesB);

			for (var i = 0; i < axesA.length; i++) {
				let axis = axesA[i];
				let projectionA = getProjection(axis, verticesA);
				let projectionB = getProjection(axis, verticesB);

				if (!(projectionB.max >= projectionA.min && projectionA.max >= projectionB.min)) {
					return false;
				}
			}

			for (var i = 0; i < axesB.length; i++) {
				let axis = axesB[i];
				let projectionA = getProjection(axis, verticesA);
				let projectionB = getProjection(axis, verticesB);

				if (!(projectionB.max >= projectionA.min && projectionA.max >= projectionB.min)) {
					return false;
				}
			}

			return true;
		}

		return getResult(shapeA.vertices, shapeB.vertices);
	}
};