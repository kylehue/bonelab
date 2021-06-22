const overlay = require("./overlay.js");
const globals = {};

const dialogApp = new Vue({
	el: "#dialogApp",
	data: {
		hidden: true,
		inputHidden: true,
		errorHidden: true,
		proceedHidden: false,
		cancelHidden: true,
		title: "Title",
		description: "Description",
		proceedText: "Accept",
		cancelText: "Decline",
		error: ""
	},
	methods: {
		proceed: function() {},
		cancel: function() {},
		show: function(options) {
			options = options || {};
			this.title = options.title;
			this.description = options.description;
			this.proceedText = options.proceedText;
			this.cancelText = options.cancelText;
			this.proceedHidden = options.proceedHidden || false;
			this.cancelHidden = options.cancelHidden || false;
			this.inputHidden = options.inputHidden || false;
			this.hidden = false;

			if (typeof options.proceedFunction == "function") {
				this.proceed = options.proceedFunction;
			}

			if (typeof options.cancelFunction == "function") {
				this.cancel = options.cancelFunction;
			}

			overlay.hidden = false;
		},
		toggleCenter: function(id, center) {
			let checkState = setInterval(function() {
				let button = document.getElementById(id);
				if (button) {
					if (center) button.classList.add("center");
					else button.classList.remove("center");
					clearInterval(checkState);
				}
			}, 10);
		},
		showError: function(message) {
			this.errorHidden = false;
			this.error = message;
		},
		hide: function() {
			this.hidden = true;
			overlay.hidden = true;
		}
	}
});

module.exports = {
	getApp: function () {
		return dialogApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};