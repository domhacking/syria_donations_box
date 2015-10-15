'use strict';

var watchify   = require('watchify'),
		browserify = require('browserify'),
		gulp       = require('gulp'),
		source     = require('vinyl-source-stream'),
		buffer     = require('vinyl-buffer'),
		gutil      = require('gulp-util'),
		sourcemaps = require('gulp-sourcemaps'),
		assign     = require('lodash.assign'),
		gulpif     = require('gulp-if'),
		uglify     = require('gulp-uglify');


var customOpts = {
	entries: ['./source/js/app.js'],
	debug: true
};

var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

b.transform('ractivate');
b.on('update', bundle);
b.on('log', gutil.log);


function bundle() {
	return b.bundle()
		.on('error', gutil.log.bind(gutil, 'Browserify Error'))
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulpif(customOpts.debug,
			sourcemaps.init({loadMaps: true}),
			uglify({ preserveComments: false })
		))
		.pipe(gulpif(customOpts.debug, sourcemaps.write('./')))
		.pipe(gulp.dest('./public/js'));
}

bundle.build = function() {
	// no need for sourcemaps
	customOpts.debug = false;

	// we only need browserify for this task
	b = browserify(customOpts);
	b.transform('ractivate');
	b.on('log', gutil.log);

	return bundle();
}

module.exports = bundle;
