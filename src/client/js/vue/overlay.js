const globals = {};

const overlay = new Vue({
	el: "#overlay",
	data: {
		hidden: true
	}
});

module.exports = {
	getApp: function () {
		return overlay;
	},
	set: function(name, value) {
		globals[name] = value;
	}
};