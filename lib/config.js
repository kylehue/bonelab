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
		size: 1500,
		wallWidth: 10,
		background: "#3a363d"
	},
	player: {
		zoom: 300,
		radius: 6,
		speed: 2,
		acceleration: 0.2,
		controls: {
			moveUp: 87,
			moveRight: 65,
			moveDown: 83,
			moveLeft: 68
		}
	},
	zombie: {
		fieldOfView: {
			angle: Math.PI / 2,
			distance: 400
		},
		speed: 1.2,
		radius: 6
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