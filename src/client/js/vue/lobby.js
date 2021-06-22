const config = require("../../../../lib/config.js");
const utils = require("./utils.js");
const dialogApp = require("./dialog.js").getApp();
const roomApp = require("./room.js").getApp();
const overlay = require("./overlay.js").getApp();
const globals = {};

const lobbyApp = new Vue({
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
		hidden: true
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
			globals.client.sendChat(globals.client.codename, message);
		},
		logout: function() {
			dialogApp.show({
				title: "Logout",
				description: "Are you sure?",
				proceedText: "Yes",
				cancelText: "Back",
				inputHidden: true,
				proceedFunction: function() {
					globals.client.logout();
					if (sessionStorage[config.sessionKey]) delete sessionStorage[config.sessionKey];
					dialogApp.hide();
					utils.showApp("loginApp");
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

module.exports = {
	getApp: function () {
		return lobbyApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};