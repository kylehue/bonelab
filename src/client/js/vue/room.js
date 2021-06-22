const config = require("../../../../lib/config.js");
const client = require("./../client.js");

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
			roomApp.hidden = true;
			require("./overlay.js").hidden = true;
		},
		join: function() {
			let description = document.getElementById("roomDescription").value;
			let waves = parseInt(document.getElementById("roomWaves").value);
			let password = document.getElementById("roomPassword").value;
			roomApp.waveErrorHidden = true;

			if (waves > config.maxWaves) {
				roomApp.waveError = `— Max is ${config.maxWaves}`;
				roomApp.waveErrorHidden = false;
				return;
			}

			if (waves < config.minWaves) {
				roomApp.waveError = `— Min is ${config.minWaves}`;
				roomApp.waveErrorHidden = false;
				return;
			}

			client.createRoom(description, waves, password);

			roomApp.hidden = true;
			require("./load.js").hidden = false;
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
			roomApp.validateMin();
			roomApp.validateMax();
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

			roomApp.validateAmount();
		},
		validateDescription: function(e) {
			let value = document.getElementById("roomDescription").value;
			if (value.length > 30) {
				e.preventDefault();
			}
		}
	}
});

module.exports = roomApp;