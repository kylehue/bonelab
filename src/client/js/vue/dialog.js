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
			dialogApp.title = options.title;
			dialogApp.description = options.description;
			dialogApp.proceedText = options.proceedText;
			dialogApp.cancelText = options.cancelText;
			dialogApp.proceedHidden = options.proceedHidden || false;
			dialogApp.cancelHidden = options.cancelHidden || false;
			dialogApp.inputHidden = options.inputHidden || false;
			dialogApp.hidden = false;

			if (typeof options.proceedFunction == "function") {
				dialogApp.proceed = options.proceedFunction;
			}

			if (typeof options.cancelFunction == "function") {
				dialogApp.cancel = options.cancelFunction;
			}

			require("./overlay.js").hidden = false;
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
			dialogApp.errorHidden = false;
			dialogApp.error = message;
		},
		hide: function() {
			dialogApp.hidden = true;
			require("./overlay.js").hidden = true;
		}
	}
});

module.exports = dialogApp;