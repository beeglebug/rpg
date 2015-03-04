var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('pixi', function() {
    return gulp.src(['./js/lib/pixi.dev.js', './js/lib/pixi.extra.js'])
        .pipe(concat('pixi.js'))
        .pipe(gulp.dest('./js/lib/'));
});