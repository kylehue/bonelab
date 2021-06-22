const globals = {};

var gameApp = new Vue({
	el: "#gameCanvas",
	data: {
		hidden: true
	}
});

module.exports = {
	getApp: function () {
		return gameApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};