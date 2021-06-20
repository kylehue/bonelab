const app = {};

const sessionKey = "RGcPyH2xAtBKokmPMIYEc2lHYQy7joC9";

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
	lobbyApp.hidden = true;
}

function showLobby() {
	loginApp.hidden = true;
	registerApp.hidden = true;
	loadApp.hidden = true;
	lobbyApp.hidden = false;
}

function showHome() {
	loginApp.hidden = false;
	registerApp.hidden = true;
	loadApp.hidden = true;
	lobbyApp.hidden = true;
}

function createLobbyMessage(name, message) {
	let elWrapper = document.createElement("div");
	elWrapper.classList.add("messageWrapper");
	let elMessage = document.createElement("p");
	elMessage.innerText = `${name}: ${message}`;
	elWrapper.appendChild(elMessage);
	let parent = document.getElementById("textAreaWrapper");
	parent.appendChild(elWrapper);
	parent.scrollTop = parent.scrollHeight;
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

var confirmDialogApp = new Vue({
	el: "#confirmDialogApp",
	data: {
		hidden: true,
		title: "Title",
		description: "Description",
		proceedText: "Accept",
		cancelText: "Decline"
	},
	methods: {
		proceed: function() {},
		cancel: function() {},
		show: function(title, description, proceedText, cancelText, proceedFunction, cancelFunction) {
			this.title = title;
			this.description = description;
			this.proceedText = proceedText;
			this.cancelText = cancelText;
			this.hidden = false;

			if (typeof proceedFunction == "function") {
				this.proceed = proceedFunction;
			}

			if (typeof cancelFunction == "function") {
				this.cancel = cancelFunction;
			}
		}
	}
})

var lobbyApp = new Vue({
	el: "#lobbyApp",
	data: {
		room: {
			sidebar: "#playerListWrapper",
			main: "#roomListWrapper"
		},
		chat: {
			sidebar: "#friendListWrapper",
			main: "#chatWrapper"
		},
		hidden: false
	},
	methods: {
		toggleSidebar: function(id) {
			let el = document.querySelector(id);
			el.classList.toggle("hideSidebar");
			el.classList.toggle("showSidebar");
		},
		sendChat: function() {
			let message = composeMessage.value;

			if (!message.length) return;

			composeMessage.value = "";
			app.client.sendChat(app.client.codename, message);
		},
		logout: function() {
			confirmDialogApp.show("Logout", "Are you sure?", "Yes", "Back", function() {
				app.client.logout();
				if (sessionStorage[sessionKey]) delete sessionStorage[sessionKey];
				confirmDialogApp.hidden = true;
				showHome();
			}, function() {
				confirmDialogApp.hidden = true;
			});
		}
	}
});

function connectClient() {
	app.client.socket.on("message:lobby", (name, message) => {
		createLobbyMessage(name, message);
	});

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
		let keys = Object.keys(data);
		for (let key of keys) {
			app.client[key] = data[key];
		}

		sessionStorage.setItem(sessionKey, data.id);

		console.log(app.client);
		showLobby();
	});

	//Load session
	window.onload = function() {
		if (sessionStorage[sessionKey]) {
			app.client.login(sessionStorage[sessionKey]);
		}else{
			showHome();
			console.log("Session has expired. Please login again");
		}
	}
}

var loadApp = new Vue({
	el: "#loadScreen",
	data: {
		hidden: true
	}
});

registerApp.hidden = true;
loginApp.hidden = true;

module.exports = {
	set: function(name, value) {
		app[name] = value;
		if (name == "client") connectClient();
	}
};