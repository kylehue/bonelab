const io = require("socket.io-client");

class Client {
	constructor() {
		this.socket = io();
		this.roomId = null;

		this.socket.on("connect", () => {

		});
	}

	sendChat(name, message) {
		this.socket.emit("client:message:lobby", name, message);
	}

	validateRegister(username, password) {
		this.socket.emit("client:register:validate", username, password);
	}

	validateLogin(username, password) {
		this.socket.emit("client:login:validate", username, password);
	}

	register(username, password) {
		this.socket.emit("client:register", username, password);
	}

	login(id) {
		this.socket.emit("client:login", id);
	}

	validateCodename(codename) {
		this.socket.emit("client:codename:validate", codename);
	}

	setCodename(codename) {
		if (!this.id) console.warn("Client ID is not defined");
		this.socket.emit("client:codename", this.id, codename);
	}

	logout() {
		if (!this.id) console.warn("Client ID is not defined");
		this.socket.emit("client:logout", this.id);
	}

	createRoom(description, waves, password) {
		this.socket.emit("client:create:room", description, waves, password);
	}

	join(roomId) {
		this.socket.emit("client:room:join", roomId);
		this.roomId = roomId;
	}

	leave() {
		this.socket.emit("client:room:leave", this.roomId);
	}
}

const client = new Client();

module.exports = client;