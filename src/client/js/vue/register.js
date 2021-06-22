const config = require("../../../../lib/config.js");
const utils = require("./utils.js");
const globals = {};

var registerApp = new Vue({
	el: "#registerApp",
	data: {
		hidden: true,
		usernameError: false,
		passwordError: false,
		cpasswordError: false,
		usernameMessage: "",
		passwordMessage: "",
		confirmMessage: ""
	},
	methods: {
		login: function() {
			this.hidden = true;
			this.usernameError = false;
			this.passwordError = false;
			this.cpasswordError = false;
			utils.showApp("loginApp");
		},
		validate: function() {
			let un = rusername.value;
			let pw = rpassword.value;
			let cpw = cpassword.value;

			if (!globals.client) utils.showApp("loadApp");

			this.usernameError = false;
			this.passwordError = false;
			this.cpasswordError = false;

			if (un.length < 4) {
				this.usernameError = true;
				this.usernameMessage = config.warnMessages.short;
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

			if (cpw.length < 6) {
				this.cpasswordError = true;
				this.confirmMessage = config.warnMessages.short;
			}

			if (!cpw.length) {
				this.cpasswordError = true;
				this.confirmMessage = config.warnMessages.blank;
			}

			if (pw !== cpw) {
				this.cpasswordError = true;
				this.confirmMessage = config.warnMessages.unmatchedPassword;
			}

			if (un.length >= 4 && pw.length >= 6 && cpw.length >= 6 && un.length && pw.length && cpw.length && pw === cpw) {
				globals.client.validateRegister(un, pw);
			}
		}
	}
});

module.exports = {
	getApp: function () {
		return registerApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};