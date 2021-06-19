const camera = require("../../../lib/camera.js");
const engine = require("./engine.js");

class Renderer {
	constructor() {
		this.canvas = document.getElementById("gameCanvas");
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		this.context = this.canvas.getContext("2d");
		this.camera = camera.create(this.context);
		this.engine = engine.create();
		this.offscreen = 0;
		this.context.offscreens = [];
		this._customOptions = ["fill", "stroke", "align", "close", "curve"];
		this._currentContext = this.context;
	}

	render(f) {
		if (typeof f !== "function") return;

		this.engine.run(() => {
			this.clear();
			f();

			if (!this.context.offscreens.length) return;
			this.drawOffscreens();
		});
	}

	getFrameCount() {
		return this.engine.frameCount;
	}

	getFrameRate() {
		return this.engine.frameRate;
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		for (let context of this.context.offscreens) {
			context.canvas.width = this.canvas.width;
			context.canvas.height = this.canvas.height;
		}
	}

	fullscreen() {
		this.setSize(innerWidth, innerHeight);
		addEventListener("resize", () => {
			this.setSize(innerWidth, innerHeight);
		});
	}

	createLayer() {
		let canvas = document.createElement("canvas");
		canvas.width = this.canvas.width;
		canvas.height = this.canvas.height;
		let context = canvas.getContext("2d");
		let data = {
			camera: this.camera
		};
		context.rendererData = data;
		this.context.offscreens.push(context);
		return context;
	}

	drawOffscreens() {
		for (var i = 0; i < this.context.offscreens.length; i++) {
			let context = this.context.offscreens[i]
			context.rendererData.camera.begin(() => {
				this.context.drawImage(context.canvas, 0, 0, context.canvas.width, context.canvas.height);
			})

			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		}
	}

	circle(x, y, radius, options, context) {
		let ctx = context || this.context;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		this._hasProperty(options, "close", () => {
			ctx.closePath();
		});

		this._evaluateOptions(options, ctx);
	}

	rect(x, y, width, height, options, context) {
		let ctx = context || this.context;
		this._hasProperty(options, "align", opt => {
			let alignment = opt.split(" ");

			if (alignment[0]) {
				if (alignment[0] == "center" || alignment[0] == "middle") {
					x -= width * 0.5;
				} else if (alignment[0] == "right") {
					x -= width;
				}
			}

			if (alignment[1]) {
				if (alignment[1] == "center" || alignment[0] == "middle") {
					y -= height * 0.5;
				} else if (alignment[1] == "bottom") {
					y -= height;
				}
			}
		});

		ctx.beginPath();
		ctx.rect(x, y, width, height);

		this._hasProperty(options, "close", () => {
			ctx.closePath();
		});

		this._evaluateOptions(options, ctx);
	}

	fromVertices(vertices, options, context) {
		let ctx = context || this.context;
		if (!vertices.length) return;

		ctx.beginPath();

		if (!this._hasProperty(options, "curve")) {
			ctx.moveTo(vertices[0].x, vertices[0].y);
			for (var i = 0; i < vertices.length; i++) {
				let vertex = vertices[i];
				ctx.lineTo(vertex.x, vertex.y);
			}
		}

		this._hasProperty(options, "curve", () => {
			ctx.beginPath();
			let first = vertices[0];
			let next = vertices[1];
			let mx = (first.x + next.x) * 0.5;
			let my = (first.y + next.y) * 0.5;
			ctx.moveTo(mx, my);
			for (var i = 1; i < vertices.length; i++) {
				let current = vertices[i];
				let next = vertices[i + 1 == vertices.length ? 0 : i + 1];
				let mx = (next.x + current.x) * 0.5;
				let my = (next.y + current.y) * 0.5;
				ctx.quadraticCurveTo(current.x, current.y, mx, my);
			}
			ctx.quadraticCurveTo(first.x, first.y, mx, my);
			ctx.lineJoin = "round";
		});

		this._hasProperty(options, "close", () => {
			ctx.closePath();
		});

		this._evaluateOptions(options, ctx);
	}

	text(text, x, y, options, context) {
		let ctx = context || this.context;
		this._hasProperty(options, "align", opt => {
			let alignment = opt.split(" ");

			if (alignment[0]) {
				if (alignment[0] == "left") {
					ctx.textAlign = "start";
				} else if (alignment[0] == "center" || alignment[0] == "middle") {
					ctx.textAlign = "center";
				} else if (alignment[0] == "right") {
					ctx.textAlign = "right";
				}
			}

			if (alignment[1]) {
				if (alignment[1] == "top") {
					ctx.textBaseline = "start";
				} else if (alignment[1] == "center" || alignment[0] == "middle") {
					ctx.textBaseline = "middle";
				} else if (alignment[1] == "bottom") {
					ctx.textBaseline = "bottom";
				}
			}
		});

		ctx.beginPath();
		this._evaluateOptions(options, ctx);
		this._hasProperty(options, "stroke", () => {
			ctx.strokeText(text, x, y);
		});

		this._hasProperty(options, "fill", () => {
			ctx.fillText(text, x, y);
		});

		this._hasProperty(options, "close", () => {
			ctx.closePath();
		});
	}

	clear(context) {
		let ctx = context || this.context;
		ctx.clearRect(0, 0, this.width, this.height);
	}

	save(context) {
		let ctx = context || this.context;
		ctx.save();
	}

	restore(context) {
		let ctx = context || this.context;
		ctx.restore();
	}

	clip(context) {
		let ctx = context || this.context;
		ctx.clip();
	}

	fill(color, context) {
		let ctx = context || this.context;
		ctx.fillStyle = color;
		ctx.fill();
	}

	stroke(color, context) {
		let ctx = context || this.context;
		ctx.strokeStyle = color;
		ctx.stroke();
	}

	_evaluateOptions(options, context) {
		let ctx = context || this.context;
		if (!options) return;

		let keys = Object.keys(options);
		for (var i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key == "stroke") ctx.strokeStyle = options[key];
			if (key == "fill") ctx.fillStyle = options[key];
			if (this._customOptions.includes(key)) continue;
			ctx[key] = options[key];
		}

		if (options.stroke) this.stroke(options.stroke, ctx);
		if (options.fill) this.fill(options.fill, ctx);
	}

	_hasProperty(options, name, callback) {
		if (options) {
			if (!options[name]) return false;
			if (typeof callback == "function") callback(options[name]);
			return options[name];
		}
	}
}

module.exports = new Renderer();