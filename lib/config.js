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
		speed: 1.5,
		acceleration: 0.2,
		controls: {
			moveUp: 87,
			moveRight: 65,
			moveDown: 83,
			moveLeft: 68
		},
		body: {
			restitution: 0,
			density: 1.4,
			friction: 0,
			frictionAir: 0.8,
			frictionStatic: 0,
			isStatic: false
		}
	},
	zombie: {
		fieldOfView: {
			angle: Math.PI * 1.5,
			distance: 600
		},
		speed: 0.4,
		radius: 6,
		body: {
			restitution: 0,
			density: 0.6,
			friction: 0,
			frictionAir: 0.8,
			frictionStatic: 0,
			isStatic: false
		}
	},
	bullet: {
		speed: 6,
		range: 200,
		radius: 1
	},
	barrier: {
		min: {
			width: 40,
			height: 40
		},
		max: {
			width: 110,
			height: 110
		},
		body: {
			restitution: 0,
			isStatic: true
		}
	}
};