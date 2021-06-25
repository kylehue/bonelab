const Stats = require("stats.js");
class Engine {
	constructor() {
		this.frameRate = 0;
		this.frameCount = 0;
		this._targetFrameRate = 60;
		this.stats = new Stats();
		this.stats.showPanel(0);
		document.body.appendChild(this.stats.dom);
	}

	run(f) {
		let startTime = performance.now();
		let lastRun = performance.now();
		let delta;
		let engine = this;
		(function animate() {
			engine.stats.begin();
			/*delta = (performance.now() - startTime) / 1000;
			engine.frameRate = 1 / delta;
			startTime = performance.now();
			engine.frameCount++;*/
			if (typeof f == "function") f();

			engine.stats.end();
			requestAnimationFrame(animate);
		})();
	}
}

module.exports = {
	create: function() {
		return new Engine();
	}
};