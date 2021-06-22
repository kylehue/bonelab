const renderer = require("../lib/renderer.js");
const vector = require("../../../lib/vector.js");
const shape = require("../../../lib/shape.js");
const mouse = require("../../../lib/mouse.js");
const key = require("../../../lib/key.js");
const utils = require("../../../lib/utils.js");
const client = require("./client.js");
const vue = require("./vue/vue.js");
vue.set("client", client);

window.client = client;

renderer.fullscreen();
renderer.render(function() {
	
});