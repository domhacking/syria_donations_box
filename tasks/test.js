'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint');

module.exports = function() {
  return gulp.src(['./source/js/**/**.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
};
