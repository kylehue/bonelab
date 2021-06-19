const Datastore = require("nedb");
const fs = require("fs");

class Database {
	constructor() {
		this.tables = [];
		this.loadTables();
	}

	loadTables() {
		let files = fs.readdirSync("./server/database");
		for (var i = 0; i < files.length; i++) {
			let name = files[i].split(".db")[0];
			let added = this.tables.find(tb => tb.name == name);
			if (!added) {
				this.load(name);
			}
		}
	}

	load(name) {
		let database = new Datastore(`./server/database/${name}.db`);
		database.loadDatabase();
		this.tables.push({
			name: name,
			data: database
		});
		return database;
	}

	in (name) {
		let table = this.tables.find(tb => tb.name == name);
		return table.data;
	}
}

module.exports = new Database();