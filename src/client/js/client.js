const io = require("socket.io-client");

class Client {
	constructor() {
		this.socket = io();

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

	logout() {
		this.socket.emit("client:logout", this.id);
	}

	createRoom(name) {
		this.socket.emit("client:create:room", this.socket.id, name);
	}

	join(roomName) {
		this.socket.emit("client:join", this.socket.id, roomName);
	}

	leave() {
		this.socket.emit("client:leave", this.socket.id);
	}
}

module.exports = new Client();