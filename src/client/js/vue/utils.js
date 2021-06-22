const config = require("../../../../lib/config.js");
const loginApp = require("./login.js");
const registerApp = require("./register.js");
const lobbyApp = require("./lobby.js");
const roomApp = require("./room.js");
const dialogApp = require("./dialog.js");
const overlay = require("./overlay.js");
const loadApp = require("./load.js");
const gameApp = require("./game.js");

const utils = {
	showApp(_app) {
		if (_app == loginApp) loginApp.hidden = false;
		else loginApp.hidden = true;
		if (_app == registerApp) registerApp.hidden = false;
		else registerApp.hidden = true;
		if (_app == lobbyApp) lobbyApp.hidden = false;
		else lobbyApp.hidden = true;
		if (_app == roomApp) roomApp.hidden = false;
		else roomApp.hidden = true;
		if (_app == dialogApp) dialogApp.hidden = false;
		else dialogApp.hidden = true;
		if (_app == overlay) overlay.hidden = false;
		else overlay.hidden = true;
		if (_app == loadApp) loadApp.hidden = false;
		else loadApp.hidden = true;
		if (_app == gameApp) gameApp.hidden = false;
		else gameApp.hidden = true;
	},
	addRoom: function(options) {
		if (!lobbyApp.hidden) {
			let numberWrapper = document.createElement("div");
			numberWrapper.classList.add("roomDetail");
			numberWrapper.dataset.colname = "number";

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
			descriptionWrapper.dataset.colname = "description";

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
			waveWrapper.dataset.colname = "wave";

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
			playersWrapper.dataset.colname = "players";

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
	},
	createLobbyMessage: function(name, message) {
		if (!lobbyApp.hidden) {
			let elWrapper = document.createElement("div");
			elWrapper.classList.add("messageWrapper");
			let elMessage = document.createElement("p");
			elMessage.innerText = `${name}: ${message}`;
			elWrapper.appendChild(elMessage);
			let parent = document.getElementById("textAreaWrapper");
			parent.appendChild(elWrapper);

			let allMessages = parent.children;
			if (allMessages.length > config.maxMessageHistory) {
				allMessages[0].remove();
			}

			parent.scrollTop = parent.scrollHeight;
		}
	}
};

module.exports = utils;