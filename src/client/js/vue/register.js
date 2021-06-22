const config = require("../../../../lib/config.js");
const client = require("./../client.js");

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
			registerApp.hidden = true;
			registerApp.usernameError = false;
			registerApp.passwordError = false;
			registerApp.cpasswordError = false;
			require("./login.js").hidden = false;
		},
		validate: function() {
			let un = rusername.value;
			let pw = rpassword.value;
			let cpw = cpassword.value;

			registerApp.usernameError = false;
			registerApp.passwordError = false;
			registerApp.cpasswordError = false;

			if (un.length < 4) {
				registerApp.usernameError = true;
				registerApp.usernameMessage = config.warnMessages.short;
			}

			if (!un.length) {
				registerApp.usernameError = true;
				registerApp.usernameMessage = config.warnMessages.blank;
			}

			if (pw.length < 6) {
				registerApp.passwordError = true;
				registerApp.passwordMessage = config.warnMessages.short;
			}

			if (!pw.length) {
				registerApp.passwordError = true;
				registerApp.passwordMessage = config.warnMessages.blank;
			}

			if (cpw.length < 6) {
				registerApp.cpasswordError = true;
				registerApp.confirmMessage = config.warnMessages.short;
			}

			if (!cpw.length) {
				registerApp.cpasswordError = true;
				registerApp.confirmMessage = config.warnMessages.blank;
			}

			if (pw !== cpw) {
				registerApp.cpasswordError = true;
				registerApp.confirmMessage = config.warnMessages.unmatchedPassword;
			}

			if (un.length >= 4 && pw.length >= 6 && cpw.length >= 6 && un.length && pw.length && cpw.length && pw === cpw) {
				client.validateRegister(un, pw);
			}
		}
	}
});

module.exports = registerApp;