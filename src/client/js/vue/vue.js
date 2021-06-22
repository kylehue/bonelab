const globals = {};

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

utils.set("apps", [{
	name: "loginApp",
	app: loginApp.getApp()
}, {
	name: "registerApp",
	app: registerApp.getApp()
}, {
	name: "lobbyApp",
	app: lobbyApp.getApp()
}, {
	name: "roomApp",
	app: roomApp.getApp()
}, {
	name: "loadApp",
	app: loadApp.getApp()
}, {
	name: "gameApp",
	app: gameApp.getApp()
}]);

let setCodename = false;

function connectClient() {
	loginApp.set("client", globals.client);
	registerApp.set("client", globals.client);
	lobbyApp.set("client", globals.client);
	roomApp.set("client", globals.client);


	globals.client.socket.on("client:room:enter", () => {

		utils.showApp("gameApp");
	});

	globals.client.socket.on("room:update", rooms => {
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
					if (child.dataset.colname == "number") {
						child.getElementsByTagName("p")[0].innerText = room.index;
					} else if (child.dataset.colname == "description") {
						child.getElementsByTagName("p")[0].innerText = room.description;
					} else if (child.dataset.colname == "wave") {
						child.getElementsByTagName("p")[0].innerText = room.currentWave;
					} else if (child.dataset.colname == "players") {
						child.getElementsByTagName("p")[0].innerText = room.players.length;
					}
				}
			} else {
				utils.addRoom(room);
			}
		}
	});

	globals.client.socket.on("client:join", roomId => {
		globals.client.join(roomId);
	});

	globals.client.socket.on("message:lobby", (name, message) => {
		utils.createLobbyMessage(name, message);
	});

	globals.client.socket.on("client:register:error", error => {
		if (error == "duplicate") {
			registerApp.getApp().usernameError = true;
			registerApp.getApp().usernameMessage = config.warnMessages.taken;
		}
	});

	globals.client.socket.on("client:register:success", (un, pw) => {
		registerApp.getApp().login();
		globals.client.register(un, pw);
	});

	globals.client.socket.on("client:login:error", error => {
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

	globals.client.socket.on("client:login:success", id => {
		utils.showApp("loadApp");
		globals.client.login(id);
	});

	globals.client.socket.on("client:codename:error", error => {
		if (error == "duplicate") {
			dialogApp.getApp().showError("This name is already taken");
		}
	});

	globals.client.socket.on("client:codename:success", codename => {
		dialogApp.getApp().errorHidden = true;
		dialogApp.getApp().error = "";

		if (setCodename) {
			globals.client.setCodename(codename);
			globals.client.codename = codename;
			dialogApp.getApp().hide();
		}
	});

	globals.client.socket.on("client:load", data => {
		let keys = Object.keys(data);
		for (let key of keys) {
			globals.client[key] = data[key];
		}

		//Ask the user for a codename if it doesn't have one yet
		if (globals.client.codename === "") {
			function validateCodename(codename, callback) {
				dialogApp.getApp().errorHidden = true;
				dialogApp.getApp().error = "";

				if (codename.length < 4) {
					dialogApp.getApp().showError("That's too short");
				}

				if (!codename.length) {
					dialogApp.getApp().showError("This field is required");
				}

				if (!codename.length || codename.length < 4) return;

				globals.client.validateCodename(codename);
			}

			dialogApp.getApp().show({
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

		console.log(globals.client);
		utils.showApp("lobbyApp");
	});

	//Load session
	window.onload = function() {
		if (sessionStorage[config.sessionKey]) {
			globals.client.login(sessionStorage[config.sessionKey]);
		} else {
			utils.showApp("loginApp");
			console.log("Session has expired. Please login again");
		}
	}
}

window.utils = utils;

module.exports = {
	set: function(name, value) {
		globals[name] = value;
		if (name == "client") connectClient();
	}
};