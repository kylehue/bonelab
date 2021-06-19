function random(min, max) {
	return Math.random() * (max - min) + min;
}

class Vector {
	constructor() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		this.x = x ? x : 0;
		this.y = y ? y : 0;
	}

	add() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (typeof x == "number") this.x += x;
		if (typeof y == "number") this.y += y;
		return this;
	}

	sub() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (typeof x == "number") this.x -= x;
		if (typeof y == "number") this.y -= y;
		return this;
	}

	mult() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (typeof x == "number") this.x *= x;
		if (typeof y == "number") this.y *= y;
		return this;
	}

	div() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (typeof x == "number") this.x /= x;
		if (typeof y == "number") this.y /= y;
		return this;
	}

	set() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (typeof x == "number") this.x = x;
		if (typeof y == "number") this.y = y;
		return this;
	}

	reset() {
		this.x = 0;
		this.y = 0;
		return this;
	}

	limit(n) {
		n = n || 1;
		if (this.getMag() >= n) this.setMag(n);
		return this;
	}

	lerp(v, weight) {
		weight = weight || 0.1;
		if (typeof v.x == "number") this.x = weight * (v.x - this.x) + this.x;
		if (typeof v.y == "number") this.y = weight * (v.y - this.y) + this.y;
		return this;
	}

	dist() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		return Math.sqrt((this.x - x) * (this.x - x) + (this.y - y) * (this.y - y));
	}

	heading() {
		let x = typeof arguments[0] == "object" ? arguments[0].x : arguments[0];
		let y = typeof arguments[0] == "object" ? arguments[0].y : arguments[1];
		if (!arguments.length) return Math.atan2(this.y, this.x);
		return Math.atan2(y - this.y, x - this.x);
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	setMag(n) {
		let len = this.getMag();
		len = len == 0 ? 0.001 : len;
		this.x *= (1 / len) * n;
		this.y *= (1 / len) * n;
		return this;
	}

	getMag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	random2D(n) {
		n = typeof n != "number" ? 1 : n;

		this.x = random(-n, n);
		this.y = random(-n, n);
		this.setMag(n);
		return this;
	}
}

module.exports = function(x, y) {
	return new Vector(x, y);
};