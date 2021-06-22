const renderer = require("../lib/renderer.js");
const vector = require("../../../lib/vector.js");
const shape = require("../../../lib/shape.js");
const mouse = require("../../../lib/mouse.js");
const key = require("../../../lib/key.js");
const utils = require("../../../lib/utils.js");
const client = require("./client.js");
const vue = require("./vue/vue.js");

const room = require("./classes/room.js");

window.client = client;

let circles = [];

/*for(var i = 0; i < 1000; i++){
	circles.push({
		pos: vector(utils.random(0, innerWidth), utils.random(0, innerHeight)),
		radius: utils.random(5, 20)
	})
}*/

renderer.fullscreen();
renderer.render(function() {
	/*for(var i = 0; i < circles.length; i++){
		let circle = circles[i];
		renderer.circle(circle.pos.x, circle.pos.y, circle.radius, {
			fill: "white"
		})
	}*/
	/*renderer.circle(100, 100, 100, {
		fill: "white"
	})*/
});