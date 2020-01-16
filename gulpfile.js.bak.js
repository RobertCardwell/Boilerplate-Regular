const gulp = require('gulp');

const sass = require('gulp-sass');

const browserSync = require('browser-sync').create();

// compile scss into css
function style() {
  // 1. where is my scss file
  return gulp.src('./sass/**/*.scss')
    // 2. pass that file throught the sass compiler
    .pipe(sass().on('error', sass.logError)) // logError option makes the console msg more succinct
    // 3. where do I save the compiled css?
    .pipe(gulp.dest('./css/main.css'))
    // 4. stream changes to all browsers
    .pipe(browserSync.stream()); // sends changes to all browsers
}

function watch() {
  browserSync.init({
    server: {
      baseDir: './',
    },
  });
  // to run 'gulp style' automatically:
  gulp.watch('./sass/**/*.scss', style);
  // to run 'gulp style' refresh browser, automatically
  gulp.watch('./**/*.html', style).on('change', browserSync.reload);
  gulp.watch('./js/**/*.js', style).on('change', browserSync.reload);
}

exports.style = style;
exports.watch = watch;
