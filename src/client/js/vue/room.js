const config = require("../../../../lib/config.js");
const globals = {};

const roomApp = new Vue({
	el: "#roomApp",
	data: {
		hidden: true,
		descriptionErrorHidden: true,
		waveErrorHidden: true,
		descriptionError: "",
		waveError: ""
	},
	methods: {
		close: function() {
			this.hidden = true;
			overlay.hidden = true;
		},
		join: function() {
			let description = document.getElementById("roomDescription").value;
			let waves = parseInt(document.getElementById("roomWaves").value);
			let password = document.getElementById("roomPassword").value;
			this.waveErrorHidden = true;

			if (waves > config.maxWaves) {
				this.waveError = `— Max is ${config.maxWaves}`;
				this.waveErrorHidden = false;
				return;
			}

			if (waves < config.minWaves) {
				this.waveError = `— Min is ${config.minWaves}`;
				this.waveErrorHidden = false;
				return;
			}

			globals.client.createRoom(description, waves, password);

			utils.showApp("loadApp");
		},
		validateFormat: function(e) {
			if (e.keyCode != 8 & e.keyCode != 46) {
				let nums = new RegExp("[0-9]");
				if (!nums.test(e.key)) {
					e.preventDefault();
					return;
				}
			}
		},
		validateAmount: function() {
			this.validateMin();
			this.validateMax();
		},
		validateMax: function(e) {
			let value = document.getElementById("roomWaves").value;
			if (parseInt(value) > config.maxWaves) {
				document.getElementById("roomWaves").value = config.maxWaves.toString();
			}
		},
		validateMin: function(e) {
			let value = document.getElementById("roomWaves").value;
			if (parseInt(value) < config.minWaves) {
				document.getElementById("roomWaves").value = config.minWaves.toString();
			}
		},
		toggleAmount: function(e) {
			let isDown = e.wheelDeltaY < 0;
			let value = parseInt(document.getElementById("roomWaves").value);
			if (isDown) {
				value--;
			} else {
				value++;
			}
			document.getElementById("roomWaves").value = value.toString();

			this.validateAmount();
		},
		validateDescription: function(e) {
			let value = document.getElementById("roomDescription").value;
			if (value.length > 30) {
				e.preventDefault();
			}
		}
	}
});

module.exports = {
	getApp: function () {
		return roomApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};