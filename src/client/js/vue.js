(function() {
	const messages = {
		blank: "— This field is required",
		short: "— Too short",
		unmatchedPassword: "— Password don't match"
	};

	var loginApp = new Vue({
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
				registerApp.hidden = false;
				loadApp.hidden = true;
				this.hidden = true;
				this.usernameError = false;
				this.passwordError = false;
			},
			validate: function() {
				let un = username.value;
				let pw = password.value;

				if (!un.length || un.length < 4) {
					this.usernameError = true;
				} else {
					this.usernameError = false;
				}

				if (!pw.length || pw.length < 6) {
					this.passwordError = true;
				} else {
					this.passwordError = false;
				}

				if (!un.length) {
					this.usernameMessage = messages.blank;
				}

				if (!pw.length) {
					this.passwordMessage = messages.blank;
				}
			}
		}
	});

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
				loginApp.hidden = false;
				loadApp.hidden = true;
				this.hidden = true;
				this.usernameError = false;
				this.passwordError = false;
				this.cpasswordError = false;
			},
			validate: function() {
				let un = rusername.value;
				let pw = rpassword.value;
				let cpw = cpassword.value;

				if (!un.length || un.length < 4) {
					this.usernameError = true;
				} else {
					this.usernameError = false;
				}

				if (!pw.length || pw.length < 6) {
					this.passwordError = true;
				} else {
					this.passwordError = false;
				}

				if (!pw.length || pw.length < 6 || pw !== cpw) {
					this.cpasswordError = true;
				} else {
					this.cpasswordError = false;
				}

				if (un.length < 4) {
					this.usernameMessage = messages.short;
				}

				if (pw.length < 6) {
					this.passwordMessage = messages.short;
				}

				if (cpw.length < 6) {
					this.confirmMessage = messages.short;
				}

				if (!un.length) {
					this.usernameMessage = messages.blank;
				}

				if (!pw.length) {
					this.passwordMessage = messages.blank;
				}

				if (!cpw.length) {
					this.confirmMessage = messages.blank;
				}

				if (pw !== cpw) {
					this.confirmMessage = messages.unmatchedPassword;
				}
			}
		}
	});

	var loadApp = new Vue({
		el: "#loadScreen",
		data: {
			hidden: true
		}
	});
})();