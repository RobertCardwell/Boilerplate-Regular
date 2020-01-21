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

// File path variables
const files = {
  scssPath: './src/scss/**/*.scss',
  jsPath: './src/js/**/*.js',
  htmlPath: './src/pages/**/*.html',
  indexPath: './index.html',
};

// Sass task
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist'))
    .pipe(browser.reload({ stream: true }));
}

// JS task
function jsTask() {
  return src(files.jsPath)
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(dest('dist'))
    .pipe(browser.reload({ stream: true }));
}

// HTML task
function htmlTask() {
  return src(files.htmlPath)
    .pipe(browser.reload({ stream: true }));
}

// Index.html task  // This is separate from the HTML task because
// I can't see how to have one watch task watch the html files in two
// and only two folders.
function indexTask() {
  return src(files.indexPath)
    .pipe(browser.reload({ stream: true }));
}

// Cachebusting task
const cbString = new Date().getTime();
function cacheBustTask() {
  return src(['./index.html'])
    // .pipe(replace(/cb=\d+/g, 'cb=' + cbString)) // elint rejects this
    .pipe(replace(/cb=\d+/g, `cb=${cbString}`))
    .pipe(dest('.'));
}

// Watch task
// function watchTask() {
//   browser.init({
//     server: {
//       baseDir: './',
//     },
//   });
//   watch([files.scssPath, files.jsPath],
//     series(
//       parallel(scssTask, jsTask),
//       cacheBustTask,
//     ));
// }

// The above always results in reloading of pages when
// any change is made to SCSS or JS files whereas the function
// below injects SCSS changes (but still reloads for JS changes).

function watchTask() {
  browser.init({
    server: {
      baseDir: './',
    },
  });
  watch([files.scssPath],
    series(
      scssTask,
      cacheBustTask,
    ));
  watch([files.jsPath],
    series(
      jsTask,
      cacheBustTask,
    ));
  watch([files.htmlPath],
    series(
      htmlTask,
    ));
  watch([files.indexPath],
    series(
      indexTask,
    ));
}

// Default task
exports.default = series(
  parallel(scssTask, jsTask),
  htmlTask,
  indexTask,
  cacheBustTask,
  watchTask,
);
