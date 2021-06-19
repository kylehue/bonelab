const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const jshint = require("gulp-jshint");
const jsuglify = require("gulp-uglify");
const cssuglify = require("gulp-uglifycss")
const htmlminify = require("gulp-minify-html");
const imgminify = require("gulp-imagemin");
const babel = require("gulp-babel");
const webpack = require("webpack-stream");

const paths = {
	client: {
		entry: "src/client/js/app.js",
		img: "src/client/assets/images/*.*",
		js: "src/client/**/*.js",
		css: "src/client/**/*.css",
		html: "src/client/index.html",
		all: "src/client/**/*.*"
	},
	server: {
		js: "src/server/**/*.js",
		db: "src/server/database/*.db",
		all: "src/server/**/*.*"
	},
	lib: {
		js: "lib/**/*.js"
	}
};

const babelConfig = {
	presets: ['@babel/preset-env']
};

gulp.task("client:entry", function() {
	return gulp.src([paths.client.entry])
		.pipe(babel(babelConfig))
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(webpack(require("./webpack.config.js")))
		.pipe(jsuglify())
		.pipe(gulp.dest("dist/client/js/"));
});

gulp.task("client:js", function() {
	return gulp.src([paths.client.js, `!${paths.client.entry}`])
		.pipe(babel(babelConfig))
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jsuglify())
		.pipe(gulp.dest("dist/client/"));
});

gulp.task("client:css", function() {
	return gulp.src([paths.client.css])
		.pipe(cssuglify())
		.pipe(gulp.dest("dist/client/"));
});

gulp.task("client:img", function() {
	return gulp.src([paths.client.img])
		.pipe(imgminify())
		.pipe(gulp.dest("dist/client/assets/images/"));
});

gulp.task("client:html", function() {
	return gulp.src([paths.client.html])
		.pipe(htmlminify())
		.pipe(gulp.dest("dist/client/"));
});

gulp.task("server:js", function() {
	return gulp.src([paths.server.js])
		.pipe(babel(babelConfig))
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jsuglify())
		.pipe(gulp.dest("dist/server/"));
});

gulp.task("server:db", function() {
	return gulp.src([paths.server.db])
		.pipe(gulp.dest("dist/server/"));
});

gulp.task("lib:js", function() {
	return gulp.src([paths.lib.js])
		.pipe(babel(babelConfig))
		.pipe(jshint())
		.pipe(jshint.reporter("default"))
		.pipe(jsuglify())
		.pipe(gulp.dest("dist/lib/"));
});

gulp.task("build:client", gulp.series(["client:entry", "client:js", "client:css", "client:img", "client:html"]));

gulp.task("build:server", gulp.series(["server:js", "server:db"]));

gulp.task("build:lib", gulp.series(["lib:js"]));

gulp.task("build", gulp.series(["build:server", "build:client", "build:lib"]));

gulp.task("watch", function() {
	gulp.watch([paths.client.all], gulp.series(["build:client"]));
	gulp.watch([paths.server.all], gulp.series(["build:server", "build:client"]));
	gulp.watch([paths.lib.js], gulp.series(["build:lib", "build:client"]));
});

gulp.task("run", gulp.series(["build"], function() {
	return nodemon({
		delay: 0,
		script: "server/server.js",
		cwd: "dist/"
	});
}));