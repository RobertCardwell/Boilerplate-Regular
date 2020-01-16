// Initialize Modules

// Make these vars explicit
const {
  src, dest, watch, series, parallel,
} = require('gulp');

const autoprefixer = require('autoprefixer');
const browser = require('browser-sync').create();
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const postcss = require('gulp-postcss');
const replace = require('gulp-replace');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
// const uglifyjs = require('gulp-uglifyjs');

// File path variables
const files = {
  scssPath: 'app/scss/**/*.scss',
  jsPath: 'app/js/**/*.js',
};

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browser.stream());
}

// JS task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist'));
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(['index.html'])
    // .pipe(replace(/cb=\d+/g, 'cb=' + cbString)) // ignore linter for this
    .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
    .pipe(dest('.'));
}

// Watch task
function watchTask() {
  browser.init({
    server: {
      baseDir: './',
    },
  });
  watch([files.scssPath, files.jsPath],
    parallel(scssTask, jsTask)).on('change', browser.reload);
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask),
  cacheBustTask,
  watchTask,
);
