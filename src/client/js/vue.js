const app = {};

const sessionKey = "RGcPyH2xAtBKokmPMIYEc2lHYQy7joC9";
const maxMessageHistory = 100;
const maxWaves = 100;
const minWaves = 10;
let setCodename = false;

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
	roomApp.hidden = true;
	gameApp.hidden = true;
}

function showLobby() {
	loginApp.hidden = true;
	registerApp.hidden = true;
	loadApp.hidden = true;
	lobbyApp.hidden = false;
	roomApp.hidden = true;
	gameApp.hidden = true;
}

function showHome() {
	loginApp.hidden = false;
	registerApp.hidden = true;
	loadApp.hidden = true;
	lobbyApp.hidden = true;
	roomApp.hidden = true;
	gameApp.hidden = true;
}

function showGame() {
	gameApp.hidden = false;
	loginApp.hidden = true;
	registerApp.hidden = true;
	loadApp.hidden = true;
	lobbyApp.hidden = true;
	roomApp.hidden = true;
}

function addRoom(options) {
	if (!lobbyApp.hidden) {
		let numberWrapper = document.createElement("div");
		numberWrapper.classList.add("roomDetail");
		numberWrapper.setAttribute("columnName", "number");

		let numberContent = document.createElement("div");
		numberContent.classList.add("content");

		let numberIcon = document.createElement("img");
		numberIcon.src = "assets/svg/hash.svg";

		let numberText = document.createElement("p");
		numberText.innerHTML = "&nbsp;"
		numberText.innerText = options.index;

		numberContent.appendChild(numberIcon);
		numberContent.appendChild(numberText);
		numberWrapper.appendChild(numberContent);

		let descriptionWrapper = document.createElement("div");
		descriptionWrapper.classList.add("roomDetail");
		descriptionWrapper.setAttribute("columnName", "description");

		let descriptionContent = document.createElement("div");
		descriptionContent.classList.add("content");

		let descriptionIcon = document.createElement("img");
		descriptionIcon.src = "assets/svg/message.svg";

		let descriptionText = document.createElement("p");
		descriptionText.innerHTML = "&nbsp;"
		descriptionText.innerText = options.description;

		descriptionContent.appendChild(descriptionIcon);
		descriptionContent.appendChild(descriptionText);
		descriptionWrapper.appendChild(descriptionContent);

		let waveWrapper = document.createElement("div");
		waveWrapper.classList.add("roomDetail");
		waveWrapper.setAttribute("columnName", "wave");

		let waveContent = document.createElement("div");
		waveContent.classList.add("content");

		let waveIcon = document.createElement("img");
		waveIcon.src = "assets/svg/shield-hash.svg";

		let waveText = document.createElement("p");
		waveText.innerHTML = "&nbsp;"
		waveText.innerText = `${options.currentWave}/${options.maxWave}`;

		waveContent.appendChild(waveIcon);
		waveContent.appendChild(waveText);
		waveWrapper.appendChild(waveContent);

		let playersWrapper = document.createElement("div");
		playersWrapper.classList.add("roomDetail");
		playersWrapper.setAttribute("columnName", "players");

		let playersContent = document.createElement("div");
		playersContent.classList.add("content");

		let playersIcon = document.createElement("img");
		playersIcon.src = "assets/svg/person.svg";

		let playersText = document.createElement("p");
		playersText.innerHTML = "&nbsp;"
		playersText.innerText = `${options.players.length}/${100}`;

		playersContent.appendChild(playersIcon);
		playersContent.appendChild(playersText);
		playersWrapper.appendChild(playersContent);

		let roomWrapper = document.createElement("div");
		roomWrapper.roomId = options.id;
		roomWrapper.classList.add("roomWrapper", "glass2");
		roomWrapper.appendChild(numberWrapper);
		roomWrapper.appendChild(descriptionWrapper);
		roomWrapper.appendChild(waveWrapper);
		roomWrapper.appendChild(playersWrapper);

		let list = document.getElementById("roomListWrapper");
		list.appendChild(roomWrapper);
	}
}

function createLobbyMessage(name, message) {
	if (!lobbyApp.hidden) {
		let elWrapper = document.createElement("div");
		elWrapper.classList.add("messageWrapper");
		let elMessage = document.createElement("p");
		elMessage.innerText = `${name}: ${message}`;
		elWrapper.appendChild(elMessage);
		let parent = document.getElementById("textAreaWrapper");
		parent.appendChild(elWrapper);

		let allMessages = parent.children;
		if (allMessages.length > maxMessageHistory) {
			allMessages[0].remove();
		}

		parent.scrollTop = parent.scrollHeight;
	}
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

			if (!app.client) loadScreen();

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

			if (!app.client) loadScreen();

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

var overlay = new Vue({
	el: "#overlay",
	data: {
		hidden: true
	}
});

var dialogApp = new Vue({
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

var roomApp = new Vue({
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
			this.hidden = true;
			overlay.hidden = true;
		},
		join: function() {
			let description = document.getElementById("roomDescription").value;
			let waves = parseInt(document.getElementById("roomWaves").value);
			let password = document.getElementById("roomPassword").value;
			this.waveErrorHidden = true;

			if (waves > maxWaves) {
				this.waveError = `— Max is ${maxWaves}`;
				this.waveErrorHidden = false;
				return;
			}

			if (waves < minWaves) {
				this.waveError = `— Min is ${minWaves}`;
				this.waveErrorHidden = false;
				return;
			}

			app.client.createRoom(description, waves, password);

			loadScreen();
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
			this.validateMin();
			this.validateMax();
		},
		validateMax: function(e) {
			let value = document.getElementById("roomWaves").value;
			if (parseInt(value) > maxWaves) {
				document.getElementById("roomWaves").value = maxWaves.toString();
			}
		},
		validateMin: function(e) {
			let value = document.getElementById("roomWaves").value;
			if (parseInt(value) < minWaves) {
				document.getElementById("roomWaves").value = minWaves.toString();
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

			this.validateAmount();
		},
		validateDescription: function(e) {
			let value = document.getElementById("roomDescription").value;
			if (value.length > 30) {
				e.preventDefault();
			}
		}
	}
});

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
			dialogApp.show({
				title: "Logout",
				description: "Are you sure?",
				proceedText: "Yes",
				cancelText: "Back",
				inputHidden: true,
				proceedFunction: function() {
					app.client.logout();
					if (sessionStorage[sessionKey]) delete sessionStorage[sessionKey];
					dialogApp.hide();
					showHome();
				},
				cancelFunction: function() {
					dialogApp.hide();
				}
			});
		},
		createRoom: function() {
			roomApp.hidden = false;
			overlay.hidden = false;
		}
	}
});

function connectClient() {
	app.client.socket.on("client:room:enter", () => {

		showGame();
	});

	app.client.socket.on("room:update", rooms => {
		//Get all existing rooms
		let _existingRooms = document.getElementsByClassName("roomWrapper");

		//Make object
		let existingRooms = [];
		for (let room of _existingRooms) {
			existingRooms.push({
				id: room.roomId,
				element: room
			});
		}

		//Loop through server rooms
		for (let room of rooms) {
			let el = null;
			//Loop through existing rooms inside the DOM
			for (let existing of existingRooms) {
				//Check if the room already exists
				let rm = existingRooms.find(er => er.id == room.id);
				if (rm) {
					el = existing.element;
					break;
				}
			}

			//If the room already exists, just update it. If not, then add it to the document
			if (el) {
				let children = el.children;
				for (let child of children) {
					if (child.columnName == "number") {
						child.getElementsByTagName("p")[0].innerText = room.index;
					} else if (child.columnName == "description") {
						child.getElementsByTagName("p")[0].innerText = room.description;
					} else if (child.columnName == "wave") {
						child.getElementsByTagName("p")[0].innerText = room.currentWave;
					} else if (child.columnName == "players") {
						child.getElementsByTagName("p")[0].innerText = room.players.length;
					}
				}
			} else {
				addRoom(room);
			}
		}
	});

	app.client.socket.on("client:join", roomId => {
		app.client.join(roomId);
	});

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

	app.client.socket.on("client:codename:error", error => {
		if (error == "duplicate") {
			dialogApp.showError("This name is already taken");
		}
	});

	app.client.socket.on("client:codename:success", codename => {
		dialogApp.errorHidden = true;
		dialogApp.error = "";

		if (setCodename) {
			app.client.setCodename(codename);
			app.client.codename = codename;
			dialogApp.hide();
		}
	});

	app.client.socket.on("client:load", data => {
		let keys = Object.keys(data);
		for (let key of keys) {
			app.client[key] = data[key];
		}

		//Ask the user for a codename if it doesn't have one yet
		if (app.client.codename === "") {
			function validateCodename(codename, callback) {
				dialogApp.errorHidden = true;
				dialogApp.error = "";

				if (codename.length < 4) {
					dialogApp.showError("That's too short");
				}

				if (!codename.length) {
					dialogApp.showError("This field is required");
				}

				if (!codename.length || codename.length < 4) return;

				app.client.validateCodename(codename);
			}

			dialogApp.show({
				title: "Name",
				description: "What would you like others to call you?",
				proceedText: "Continue",
				cancelText: "Check",
				inputHidden: false,
				cancelHidden: false,
				proceedFunction: function() {
					let codename = document.getElementById("dialogInput").value;
					validateCodename(codename);
					setCodename = true;
				},
				cancelFunction: function() {
					let codename = document.getElementById("dialogInput").value;
					validateCodename(codename);
				}
			});
		}

		sessionStorage.setItem(sessionKey, data.id);

		console.log(app.client);
		showLobby();
	});

	//Load session
	window.onload = function() {
		if (sessionStorage[sessionKey]) {
			app.client.login(sessionStorage[sessionKey]);
		} else {
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

var gameApp = new Vue({
	el: "#gameCanvas",
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