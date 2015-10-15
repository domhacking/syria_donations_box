'use strict';

var gulp 	= require('gulp'),
    script = require('./tasks/script'),
    style = require('./tasks/style'),
    test = require('./tasks/test'),
    server = require('./tasks/server'),
    watch = require('./tasks/watch'),
    moduleTask = require('./tasks/module');


gulp.task('script', ['module:rebuild'], script);
gulp.task('script:build', ['test', 'module:rebuild'], script.build);

gulp.task('style', style);
gulp.task('style:build', ['test'], style.build);

gulp.task('test', test);

gulp.task('module', moduleTask);
gulp.task('module:rebuild', moduleTask.rebuild);

gulp.task('watch', watch);

gulp.task('server', ['script'], server);

gulp.task('default', ['style', 'script', 'server', 'watch']);

gulp.task('build', ['test', 'style:build', 'script:build']);
