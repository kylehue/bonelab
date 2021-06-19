module.exports = {
	lerp: function(start, stop, weight) {
		return weight * (stop - start) + start;
	},
	dist: function(x1, y1, x2, y2) {
		return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
	},
	map: function(n, start1, stop1, start2, stop2) {
		return (n - start1) / (stop1 - start1) * (stop2 - start2) + start2;
	},
	random: function() {
		if (arguments.length == 2 && typeof arguments[0] == "number" && typeof arguments[1] == "number") {
			return Math.random() * (arguments[1] - arguments[0]) + arguments[0];
		} else if (arguments.length == 1 && typeof arguments[0] == "number") {
			return Math.random() * arguments[0];
		} else if (Array.isArray(arguments[0])) {
			return arguments[0][Math.floor(Math.random() * arguments[0].length)];
		} else if (arguments.length > 2) {
			let args = [...arguments];
			return args[Math.floor(Math.random() * args.length)];
		}
	},
	constrain: function(n, min, max) {
		return Math.max(Math.min(n, max), min);
	},
	getRandomColor: function() {
		return this.random([
			"#ff3b3b",
			"#ff763b",
			"#ffdb3b",
			"#c4ff3b",
			"#76ff3b",
			"#3bff8d",
			"#3bc1ff",
			"#3b48ff",
			"#963bff",
			"#de3bff",
			"#ff3b96"
		]);
	}
};