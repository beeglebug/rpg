var project = require('./package.json');
var gulp = require('gulp');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var transform = require('vinyl-transform');

gulp.task('browserify', function() {

    var browserified = transform(function(filename) {
        var b = browserify(filename, { paths: ['./node_modules', './js/src', './js/lib'], debug : true });
        return b.bundle();
    });

    return gulp.src('./js/index.js')
        .pipe(browserified)
        .pipe(rename(project.name + '.js'))
        .pipe(gulp.dest('./build/'))
        .pipe(uglify())
        .pipe(rename(project.name + '.min.js'))
        .pipe(gulp.dest('./build/'))
    ;
});