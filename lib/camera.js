function lerp(start, stop, per) {
	return per * (stop - start) + start;
}

/*
*Modified version of robashton's camera
*Repository link:
*https://github.com/robashton/camera
*/

class Camera2D {
	constructor(context, options) {
		options = options || {};
		this.movement = {
			x: 0,
			y: 0
		};

		this.viewport = {
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: 0,
			height: 0,
			scale: [1.0, 1.0]
		};

		this.distance = 0;
		this.context = context || null;
		this.fieldOfView = options.fieldOfView || Math.PI / 4.0;
		this.moveSpeed = options.moveSpeed || 1;
		this.zoomSpeed = options.zoomSpeed || 1;
		this.scaleSpeed = options.scaleSpeed || 1;
	}

	setContext(context) {
		this.context = context;
		this.updateViewport();
	}

	setMoveSpeed(speed) {
		this.moveSpeed = speed;
	}

	setZoomSpeed(speed) {
		this.zoomSpeed = speed;
	}

	setScaleSpeed(speed) {
		this.scaleSpeed = speed;
	}

	begin(f) {
		if (typeof f != "function") return;
		this.context.save();
		this.applyScale();
		this.applyTranslation();
		f(this);
		this.context.restore();
	}

	applyScale() {
		this.context.scale(this.viewport.scale[0], this.viewport.scale[1]);
	}

	applyTranslation() {
		this.context.translate(-this.viewport.left, -this.viewport.top);
	}

	updateViewport() {
		this.aspectRatio = this.context.canvas.width / this.context.canvas.height;
		this.viewport.width = lerp(this.viewport.width, this.distance * Math.tan(this.fieldOfView), this.scaleSpeed);
		this.viewport.height = lerp(this.viewport.height, this.viewport.width / this.aspectRatio, this.scaleSpeed);
		this.viewport.left = this.movement.x - (this.viewport.width / 2);
		this.viewport.top = this.movement.y - (this.viewport.height / 2);
		this.viewport.right = this.viewport.left + this.viewport.width;
		this.viewport.bottom = this.viewport.top + this.viewport.height;
		this.viewport.scale[0] = this.context.canvas.width / this.viewport.width;
		this.viewport.scale[1] = this.context.canvas.height / this.viewport.height;
	}

	zoomTo(z) {
		this.distance = lerp(this.distance, z, this.zoomSpeed);
		this.updateViewport();
	}

	moveTo(x, y) {
		this.movement.x = lerp(this.movement.x, x, this.moveSpeed);
		this.movement.y = lerp(this.movement.y, y, this.moveSpeed);
		this.updateViewport();
	}

	screenToWorld(x, y, obj) {
		obj = obj || {
			x: (x / this.viewport.scale[0]) + this.viewport.left,
			y: (y / this.viewport.scale[1]) + this.viewport.top
		};
		return obj;
	}

	worldToScreen(x, y, obj) {
		obj = obj || {
			x: (x - this.viewport.left) * (this.viewport.scale[0]),
			y: (y - this.viewport.top) * (this.viewport.scale[1])
		};
		return obj;
	}
}

module.exports = {
	create: function (context, options) {
		return new Camera2D(context, options)
	}
};