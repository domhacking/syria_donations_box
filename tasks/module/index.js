'use strict';

var expand = require('glob-expand'),
    fs = require('fs-extra'),
    path = require('path'),
    del = require('del'),
    gulp = require('gulp'),
    minstache = require('minstache'),
    argv = require('yargs').argv,
    exec = require('child_process').execSync;

function resolve(p) {
  return path.resolve(process.cwd(), p)
}

function parseTemplate(extension, data, fileName) {
  extension = '.' + (extension || 'html');
  fileName = fileName || '_template';
  var tpl = fs.readFileSync(__dirname + '/' + fileName + extension, 'utf-8');
  return minstache(tpl, data);
}

function task(cb) {
  var name = argv.add || argv.delete || argv.remove;
  var paths = {
    script: './source/js/module/' + name,
    html: './source/js/module/' + name + '/' + name + '.html',
    js: './source/js/module/' + name + '/' + name + '.js',
    scss: './source/css/module/' + name + '.scss'
  }
  var data = { name:name, paths: paths };

  if(argv.add) {
    fs.outputFileSync(resolve(paths.html), parseTemplate("html", data));
    fs.outputFileSync(resolve(paths.js), parseTemplate("js", data));
    fs.outputFileSync(resolve(paths.scss), parseTemplate("scss", data));
    cb();
  } else {
    del([resolve(paths.script), resolve(paths.scss)], cb());
  }
}

task.rebuild = function(cb) {
  var jsModules = expand({ filter:'isFile' }, ['./source/js/module/*/*.js']);
  var scssModules = expand({ filter:'isFile' }, [
    './source/css/module/*.scss', '!./source/css/module/index.scss'
  ]);

  jsModules = jsModules.map(function(url) {
    var file = path.relative('./source/js/module', url);
    var name = path.basename(file, '.js');
    return { name:name, file: file };
  });

  scssModules = scssModules.map(function(url) {
    var file = path.relative('./source/css/module', url);
    var name = path.basename(file, '.scss');
    return { name:name, file: file };
  });

  var jsData = parseTemplate("js", { modules:jsModules }, '_index');
  var scssData = parseTemplate("scss", { modules:jsModules }, '_index');

  fs.outputFileSync(resolve('./source/js/module/index.js'), jsData);
  fs.outputFileSync(resolve('./source/css/module/index.scss'), scssData);
  
  cb();
}


module.exports = task;
