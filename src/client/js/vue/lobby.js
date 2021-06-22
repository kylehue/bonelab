const config = require("../../../../lib/config.js");
const client = require("./../client.js");

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
			client.sendChat(client.codename, message);
		},
		logout: function() {
			require("./dialog.js").show({
				title: "Logout",
				description: "Are you sure?",
				proceedText: "Yes",
				cancelText: "Back",
				inputHidden: true,
				proceedFunction: function() {
					client.logout();
					if (sessionStorage[config.sessionKey]) delete sessionStorage[config.sessionKey];
					require("./dialog.js").hide();
					require("./login.js").hidden = false;
					lobbyApp.hidden = true;
				},
				cancelFunction: function() {
					require("./dialog.js").hide();
				}
			});
			require("./overlay.js").hidden = false;
		},
		createRoom: function() {
			require("./room.js").hidden = false;
			require("./overlay.js").hidden = false;
		}
	}
});

module.exports = lobbyApp;