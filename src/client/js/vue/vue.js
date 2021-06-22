const config = require("../../../../lib/config.js");
const loginApp = require("./login.js");
const registerApp = require("./register.js");
const lobbyApp = require("./lobby.js");
const roomApp = require("./room.js");
const dialogApp = require("./dialog.js");
const overlay = require("./overlay.js");
const loadApp = require("./load.js");
const gameApp = require("./game.js");
const utils = require("./utils.js");
const client = require("./../client.js");

let setCodename = false;

client.socket.on("client:room:enter", () => {
	overlay.hidden = true;
	utils.showApp(gameApp);
});

client.socket.on("room:delete", roomId => {
	let el = document.querySelector(`[data-id='${roomId}']`);
	if (el) {
		el.remove();
	}
});

client.socket.on("room:update", room => {
	let roomElements = document.querySelectorAll(".roomWrapper");
	let existingIds = [];
	for (let roomEl of roomElements) {
		existingIds.push(roomEl.dataset.id);
	}

	if (existingIds.includes(room.id)) {
		let element = document.querySelector(`[data-id='${room.id}']`);
		let children = element.children;
		for (let child of children) {
			if (child.dataset.colname == "number") {
				child.getElementsByTagName("p")[0].innerText = room.index;
			} else if (child.dataset.colname == "description") {
				child.getElementsByTagName("p")[0].innerText = room.description;
			} else if (child.dataset.colname == "wave") {
				child.getElementsByTagName("p")[0].innerText = `${room.currentWave}/${room.maxWave}`;
			} else if (child.dataset.colname == "players") {
				child.getElementsByTagName("p")[0].innerText = `${room.players.length}/${config.maxPlayers}`;
			}
		}
	} else {
		utils.addRoom(room);
	}
});

client.socket.on("client:join", roomId => {
	client.join(roomId);
});

client.socket.on("message:lobby", (name, message) => {
	utils.createLobbyMessage(name, message);
});

client.socket.on("client:register:error", error => {
	if (error == "duplicate") {
		registerApp.usernameError = true;
		registerApp.usernameMessage = config.warnMessages.taken;
	}
});

client.socket.on("client:register:success", (un, pw) => {
	registerApp.login();
	client.register(un, pw);
});

client.socket.on("client:login:error", error => {
	if (error == "unknown") {
		if (!document.getElementById("username").value.length) return;
		loginApp.usernameError = true;
		loginApp.usernameMessage = config.warnMessages.unknown;
		loginApp.passwordError = false;
	} else if (error == "incorrect") {
		if (!document.getElementById("password").value.length) return;
		loginApp.passwordError = true;
		loginApp.passwordMessage = config.warnMessages.incorrectPassword;
	}
});

client.socket.on("client:login:success", id => {
	utils.showApp(loadApp);
	client.login(id);
});

client.socket.on("client:codename:error", error => {
	if (error == "duplicate") {
		dialogApp.showError("This name is already taken");
	}
});

client.socket.on("client:codename:success", codename => {
	dialogApp.errorHidden = true;
	dialogApp.error = "";

	if (setCodename) {
		client.setCodename(codename);
		client.codename = codename;
		dialogApp.hide();
	}
});

client.socket.on("client:load", data => {
	let keys = Object.keys(data);
	for (let key of keys) {
		client[key] = data[key];
	}

	//Ask the user for a codename if it doesn't have one yet
	if (client.codename === "") {
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

			client.validateCodename(codename);
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
				setCodename = false;
				let codename = document.getElementById("dialogInput").value;
				validateCodename(codename);
			}
		});
	}

	sessionStorage.setItem(config.sessionKey, data.id);

	console.log(client);
	utils.showApp(lobbyApp);
});

//Load session
window.onload = function() {
	if (sessionStorage[config.sessionKey]) {
		client.login(sessionStorage[config.sessionKey]);
	} else {
		utils.showApp(loginApp);
		console.log("Session has expired. Please login again");
	}
}

function showGame() {
	lobbyApp.hidden = true;
	loginApp.hidden = true;
	gameApp.hidden = false;
}

window.showGame = showGame;