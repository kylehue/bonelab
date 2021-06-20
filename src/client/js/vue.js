const app = {};

const messages = {
	blank: "— This field is required",
	short: "— Too short",
	unmatchedPassword: "— Doesn't match",
	incorrectPassword: "— Incorrect password",
	taken: "— Already taken",
	unknown: "— This doesn't exist"
};

function loadScreen() {
	loginApp.hidden = true;
	registerApp.hidden = true;
	loadApp.hidden = false;
}

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

			if (!app.client) {
				loadScreen();
			}


			if (un.length < 4) {
				this.usernameError = true;
				this.passwordMessage = messages.short;
			}

			if (!un.length) {
				this.usernameError = true;
				this.usernameMessage = messages.blank;
			}

			if (pw.length < 6) {
				this.passwordError = true;
				this.passwordMessage = messages.short;
			}

			if (!pw.length) {
				this.passwordError = true;
				this.passwordMessage = messages.blank;
			}

			if (un.length >= 4 && pw.length >= 6 && un.length && pw.length) {
				app.client.validateLogin(un, pw);
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

			if (!app.client) {
				loadScreen();
			}

			this.usernameError = false;
			this.passwordError = false;
			this.cpasswordError = false;

			if (un.length < 4) {
				this.usernameError = true;
				this.usernameMessage = messages.short;
			}

			if (!un.length) {
				this.usernameError = true;
				this.usernameMessage = messages.blank;
			}

			if (pw.length < 6) {
				this.passwordError = true;
				this.passwordMessage = messages.short;
			}

			if (!pw.length) {
				this.passwordError = true;
				this.passwordMessage = messages.blank;
			}

			if (cpw.length < 6) {
				this.cpasswordError = true;
				this.confirmMessage = messages.short;
			}

			if (!cpw.length) {
				this.cpasswordError = true;
				this.confirmMessage = messages.blank;
			}

			if (pw !== cpw) {
				this.cpasswordError = true;
				this.confirmMessage = messages.unmatchedPassword;
			}

			if (un.length >= 4 && pw.length >= 6 && cpw.length >= 6 && un.length && pw.length && cpw.length && pw === cpw) {
				app.client.validateRegister(un, pw);
			}
		}
	}
});

function connectClient() {
	app.client.socket.on("client:register:error", error => {
		if (error == "duplicate") {
			registerApp.usernameError = true;
			registerApp.usernameMessage = messages.taken;
		}
	});

	app.client.socket.on("client:register:success", (un, pw) => {
		registerApp.login();
		app.client.register(un, pw);
	});

	app.client.socket.on("client:login:error", error => {
		if (error == "unknown") {
			if (!document.getElementById("username").value.length) return;
			loginApp.usernameError = true;
			loginApp.usernameMessage = messages.unknown;
			loginApp.passwordError = false;
		} else if (error == "incorrect") {
			if (!document.getElementById("password").value.length) return;
			loginApp.passwordError = true;
			loginApp.passwordMessage = messages.incorrectPassword;
		}
	});

	app.client.socket.on("client:login:success", id => {
		loadScreen();
		app.client.login(id);
	});

	app.client.socket.on("client:load", data => {
		console.log(data);
	});
}

var loadApp = new Vue({
	el: "#loadScreen",
	data: {
		hidden: true
	}
});

module.exports = {
	pass: function(name, value) {
		app[name] = value;
		if (name == "client") connectClient();
	}
};