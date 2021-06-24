function getIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
	const tn = (x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4);
	const td = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	const t = tn / td;

	const un = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
	const ud = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
	const u = un / ud;
	if (t > 0 && u > 0 && u < 1) {
		return {
			x: x1 + t * (x2 - x1),
			y: y1 + t * (y2 - y1),
			t: t
		};
	} else {
		return null;
	}
}

function dist(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
}

class Ray {
	constructor() {
		this.position = {
			x: 0,
			y: 0
		};

		this.barriers = [];
		this.casts = [];
	}

	addBarrier(x1, y1, x2, y2) {
		this.barriers.push({
			pointA: {
				x: x1,
				y: y1
			},
			pointB: {
				x: x2,
				y: y2
			}
		});
	}

	cast() {
		this.casts = [];

		for (var i = 0; i < this.barriers.length; i++) {
			let barrier = this.barriers[i];
			let offset = 0.000001;

			let angle = Math.atan2(barrier.pointA.y - this.position.y, barrier.pointA.x - this.position.x) - offset;
			this.casts.push({
				x: this.position.x + Math.cos(angle),
				y: this.position.y + Math.sin(angle),
				angle: angle
			});

			angle = Math.atan2(barrier.pointA.y - this.position.y, barrier.pointA.x - this.position.x) + offset;
			this.casts.push({
				x: this.position.x + Math.cos(angle),
				y: this.position.y + Math.sin(angle),
				angle: angle
			});
		}

		for (var i = 0; i < this.casts.length; i++) {
			let cast = this.casts[i];
			let nearestIntersection;
			let t = Number.MAX_SAFE_INTEGER;
			for (var j = 0; j < this.barriers.length; j++) {
				let barrier = this.barriers[j];
				let intersection = getIntersection(this.position.x, this.position.y, cast.x, cast.y, barrier.pointA.x, barrier.pointA.y, barrier.pointB.x, barrier.pointB.y);
				if (intersection) {
					if (intersection.t < t) {
						t = intersection.t;
						nearestIntersection = intersection;
					}
				}
			}

			if (nearestIntersection) {
				cast.x = nearestIntersection.x;
				cast.y = nearestIntersection.y;
			}
		}
	}

	getShape() {
		const vertices = [];
		this.casts.sort((a, b) => a.angle - b.angle);
		for (var i = 0; i < this.casts.length; i++) {
			let cast = this.casts[i];
			vertices.push({
				x: cast.x,
				y: cast.y
			});
		}

		return vertices;
	}
}

module.exports = {
	create: function() {
		return new Ray;
	}
}