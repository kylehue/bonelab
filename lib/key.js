class Key {
	constructor() {
		this.code = null;
		this.name = null;
		this.activeKeys = {};
	}

	check(code) {
		if (typeof code == "number") return code in this.activeKeys;

		let values = Object.values(this.activeKeys);
		return values.includes(code);
	}

	on(name, f) {
		if (typeof f != "function") return;
		addEventListener(name, f);
	}
}

const key = new Key();

key.on("keydown", function (event) {
	key.code = event.keyCode;
	key.name = event.code;

	key.activeKeys[key.code] = key.name;
});

key.on("keyup", function (event) {
	key.code = event.keyCode;
	key.name = event.code;

	delete key.activeKeys[key.code];
});

module.exports = key;