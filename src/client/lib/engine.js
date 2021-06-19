class Engine {
	constructor() {
		this.frameRate = 0;
		this.frameCount = 0;
		this._targetFrameRate = 60;
	}

	run(f) {
		let startTime = performance.now();
		let lastRun = performance.now();
		let delta;
		let engine = this;
		(function animate() {
			delta = (performance.now() - startTime) / 1000;
			engine.frameRate = 1 / delta;
			startTime = performance.now();
			engine.frameCount++;
			if (typeof f == "function") f();

			requestAnimationFrame(animate);
		})();
	}
}

module.exports = {
	create: function() {
		return new Engine();
	}
};