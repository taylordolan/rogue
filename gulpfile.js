// include gulp
var gulp = require('gulp');

// include plugins
var concat = require('gulp-concat');

//concatenate and minify js files
gulp.task('concat', function() {
  return gulp.src(['js/setup.js', 'js/functions.js', 'js/objects/*.js', 'js/app.js'])
    .pipe(concat('docs/main.js'))
      .pipe(gulp.dest(''));
});

// watch js files
gulp.task('watch', function() {
  gulp.watch('js/**/*.js', ['concat']);
});

// default task
gulp.task('default', ['concat', 'watch']);
