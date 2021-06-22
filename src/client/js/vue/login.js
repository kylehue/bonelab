const config = require("../../../../lib/config.js");
const utils = require("./utils.js");
const globals = {};

const loginApp = new Vue({
	el: "#loginApp",
	data: {
		hidden: false,
		usernameError: false,
		passwordError: false,
		usernameMessage: "",
		passwordMessage: ""
	},
	methods: {
		register: function() {
			this.hidden = true;
			this.usernameError = false;
			this.passwordError = false;
			utils.showApp("registerApp");
		},
		validate: function() {
			let un = username.value;
			let pw = password.value;

			if (!globals.client) utils.showApp("loadApp");

			if (un.length < 4) {
				this.usernameError = true;
				this.passwordMessage = config.warnMessages.short;
			}

			if (!un.length) {
				this.usernameError = true;
				this.usernameMessage = config.warnMessages.blank;
			}

			if (pw.length < 6) {
				this.passwordError = true;
				this.passwordMessage = config.warnMessages.short;
			}

			if (!pw.length) {
				this.passwordError = true;
				this.passwordMessage = config.warnMessages.blank;
			}

			if (un.length >= 4 && pw.length >= 6 && un.length && pw.length) {
				globals.client.validateLogin(un, pw);
			}
		}
	}
});

module.exports = {
	getApp: function () {
		return loginApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};