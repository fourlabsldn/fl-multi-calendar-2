/* eslint-env node */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const server = require('gulp-server-livereload');

gulp.task('rollup', () => {
  gulp.src([
    './src/main.js',
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
  .pipe(gulp.dest('./build/'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.*', ['build']);
});

gulp.task('webserver', () => {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      directoryListing: true,
      open: true,
      defaultFile: './demo/index.html',
    }));
});

gulp.task('build', ['rollup']);

gulp.task('dev', ['rollup', 'watch', 'webserver']);
