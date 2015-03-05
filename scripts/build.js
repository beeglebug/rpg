/* jshint node:true */
'use strict';

var browserify = require('browserify');
var b = browserify('./js/index.js', { paths: ['./node_modules', './js/src', './js/lib'] });

b.bundle().pipe(process.stdout);