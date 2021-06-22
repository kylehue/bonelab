const client = require("./../client.js");
const config = require("../../../../lib/config.js");

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
			loginApp.hidden = true;
			loginApp.usernameError = false;
			loginApp.passwordError = false;
			require("./register.js").hidden = false;
		},
		validate: function() {
			let un = username.value;
			let pw = password.value;

			if (un.length < 4) {
				loginApp.usernameError = true;
				loginApp.passwordMessage = config.warnMessages.short;
			}

			if (!un.length) {
				loginApp.usernameError = true;
				loginApp.usernameMessage = config.warnMessages.blank;
			}

			if (pw.length < 6) {
				loginApp.passwordError = true;
				loginApp.passwordMessage = config.warnMessages.short;
			}

			if (!pw.length) {
				loginApp.passwordError = true;
				loginApp.passwordMessage = config.warnMessages.blank;
			}

			if (un.length >= 4 && pw.length >= 6 && un.length && pw.length) {
				client.validateLogin(un, pw);
			}
		}
	}
});

module.exports = loginApp;