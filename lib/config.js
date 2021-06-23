module.exports = {
	sessionKey: "RGcPyH2xAtBKokmPMIYEc2lHYQy7joC9",
	maxPlayers: 100,
	maxMessageHistory: 100,
	maxWaves: 100,
	minWaves: 10,
	warnMessages: {
		blank: "— This field is required",
		short: "— Too short",
		unmatchedPassword: "— Doesn't match",
		incorrectPassword: "— Incorrect password",
		taken: "— Already taken",
		unknown: "— This doesn't exist"
	},
	map: {
		size: 500,
		wallWidth: 10,
		maxBarriers: 10,
		background: "#3a363d"
	},
	player: {
		radius: 10,
		speed: 2,
		controls: {
			moveUp: 87,
			moveRight: 65,
			moveDown: 83,
			moveLeft: 68
		}
	},
	bullet: {
		speed: 6,
		range: 200,
		radius: 2
	},
	barrier: {
		min: {
			width: 40,
			height: 40
		},
		max: {
			width: 110,
			height: 110
		}
	}
};