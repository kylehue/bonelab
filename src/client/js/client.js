const io = require("socket.io-client");

class Client {
	constructor() {
		this.socket = io();

		this.socket.on("connect", () => {
			
		});
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

	login(username, password) {
		this.socket.emit("client:login", username, password);
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