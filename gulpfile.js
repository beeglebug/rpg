var gulp = require('gulp');
var concat = require('gulp-concat');
var wrap = require('gulp-wrap');
var through = require('gulp-through');
var changeCase = require('change-case');

var transform = through('transform', function(file, contents) {

    file.key = file.path.replace(file.base, '').replace('.json', '').split('\\').map(function(name) {
        return changeCase.camelCase(name);
    }).join('.');
});

gulp.task('pixi', function() {
    return gulp.src(['./js/lib/pixi.dev.js', './js/lib/pixi.extra.js'])
        .pipe(concat('pixi.js'))
        .pipe(gulp.dest('./js/lib/'));
});

gulp.task('data', function() {
    return gulp.src('data/**/*.json')
        .pipe(transform())
        .pipe(wrap('<%= file.key %> : <%= contents %>',{},{ parse : false }))
        .pipe(concat('data.js'))
        .pipe(wrap('var data = {\n<%= contents %>\n};'))
        .pipe(gulp.dest('./build'));
});