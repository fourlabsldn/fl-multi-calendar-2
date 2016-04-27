/* eslint-env node */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const server = require('gulp-server-livereload');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpDoxx = require('gulp-doxx');

gulp.task('assets', () => {
  return gulp.src(['./src/assets/**/*.*'])
    .pipe(gulp.dest('./build/assets'));
});


gulp.task('sass', () => {
  return gulp.src(['./src/sass/**/*.scss', '!./src/sass/**/_*.*'])
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer({ browsers: ['last 15 versions'] })]))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./build/'));
});

gulp.task('rollup-module', () => {
  gulp.src([
    './src/fl-multi-calendar.js',
  ])
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./build'));
});


gulp.task('rollup-tests', () => {
  gulp.src([
    './tests/src/*',
  ])
  .pipe(sourcemaps.init())
  .pipe(rollup({
    plugins: [
      babel({
        exclude: 'node_modules/**',
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./tests/build'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', ['build']);
  gulp.watch('./src/sass/*.*', ['sass']);
  gulp.watch('./src/assets/*.*', ['assets']);
});

gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: true,
      defaultFile: '/demo/index.html',
    }));
});

gulp.task('docs', () => {
  gulp.src(['src/*.js', 'README.md'], { base: '.' })
    .pipe(gulpDoxx({
      title: 'Multi Calendar 2',
      urlPrefix: '/docs',
    }))
    .pipe(gulp.dest('docs'));
});

gulp.task('demo', ['webserver']);
gulp.task('rollup', ['rollup-module', 'rollup-tests']);
gulp.task('build', ['rollup', 'sass', 'assets']);
gulp.task('build-docs', ['docs']);

gulp.task('dev', ['build', 'watch', 'webserver']);
