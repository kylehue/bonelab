const globals = {};

var loadApp = new Vue({
	el: "#loadScreen",
	data: {
		hidden: true
	}
});

module.exports = {
	getApp: function () {
		return loadApp;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};