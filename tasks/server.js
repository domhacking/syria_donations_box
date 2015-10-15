'use strict';

var browserSync = require('browser-sync').create();

module.exports = function() {
	return browserSync.init({
		open: false,
		files: ['./public/css/*.css', './public/js/*.js', './public/*.html'],
		server: {
			baseDir: './public'
		}
	});
}
