'use strict';

var fs         = require('fs'),
    path       = require('path'),
    gulp       = require('gulp'),
    sass       = require('gulp-sass'),
    gulpif     = require('gulp-if'),
    prefix     = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    minify     = require('gulp-minify-css');


var debug = true;
var aliases = {};


/**
 * Will look for .scss and .css files inside the node_modules folder
 */
function npmModule(url, file, done) {
  // check if the path was already found and cached
  if(aliases[url]) {
    return done({ file:aliases[url] });
  }

  // look for SCSS modules installed through npm
  try {
    var newPath = path.relative('./source/css', require.resolve(url));
    aliases[url] = newPath;
    return done({ file:newPath });
  } catch(e) { }

  // if not, try looking if the file inside the `node_modules` exists
  var absolute = path.join(process.cwd(), 'node_modules', url);
  var relative = path.relative('./source/css', absolute).replace(/\.css$/g, '');
  fs.access(absolute, fs.R_OK, function(err, res) {
    aliases[url] = err ? url : relative;
    done(aliases[url]);
  });
}


function bundle() {
  return gulp.src('./source/css/app.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({ importer:npmModule }))
    // .pipe(sourcemaps.write())
    .pipe(prefix({ browsers:['last 2 versions', 'ie 9'] }))
    .pipe(gulpif(!debug, minify({ keepSpecialComments:false })))
    .pipe(gulp.dest('./public/css'));
}


bundle.build = function() {
  debug = false;
  return bundle();
}

module.exports = bundle;
