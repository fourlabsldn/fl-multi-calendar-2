/* eslint-env node */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('rollup-plugin-babel');
const rollup = require('gulp-rollup');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const server = require('gulp-server-livereload');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const gulpDoxx = require('gulp-doxx');
const jasmineBrowser = require('gulp-jasmine-browser');
const open = require('gulp-open');
const watch = require('gulp-watch');
// const uglify = require('gulp-uglify');
const foreach = require('gulp-foreach');
const depLinker = require('dep-linker');
// -------------------------------------------------------
//            SOURCE
// -------------------------------------------------------
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
  gulp.src('./src/fl-multi-calendar.js')
  .pipe(sourcemaps.init())
  .pipe(rollup({
    // Function names leak to the global namespace. To avoid that,
    // let's just put everything within an immediate function, this way variables
    // are all beautifully namespaced.
    banner: '(function () {',
    footer: '}());',
    entry: './src/fl-multi-calendar.js',
    format: 'umd',
    moduleName: 'flMultiCalendar',
    allowRealFiles: true,
    plugins: [
      // Import modules with jsnext:main
      nodeResolve({	jsnext: true, main: true }),
      // Import node modules
      commonjs(),
      babel({
        exclude: 'node_modules/**',
        babelrc: false,
        presets: ['es2015-rollup'],
      }),
    ],
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('./build'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', ['build']);
  gulp.watch('./src/sass/*.*', ['sass']);
  gulp.watch('./src/assets/*.*', ['assets']);
  gulp.watch('./tests/src/*.*', ['build-tests']);
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


gulp.task('copy-dependencies', () => {
  depLinker.linkDependenciesTo('demo/dependencies');
});
// -------------------------------------------------------
//            DOCS
// -------------------------------------------------------
gulp.task('docs', () => {
  gulp.src(['src/*.js', 'README.md'], { base: '.' })
    .pipe(gulpDoxx({
      title: 'Multi Calendar 2',
      urlPrefix: '/fl-multi-calendar-2', // Name of git repo. This will be important in gh-pages
    }))
    .pipe(gulp.dest('docs'));
});


// -------------------------------------------------------
//            TESTS
// -------------------------------------------------------
gulp.task('rollup-tests', () => {
  gulp.src('./tests/src/*')
    .pipe(sourcemaps.init())
    .pipe(foreach((stream, file) => { // eslint-disable-line no-unused-vars
      const fileName = file.sourceMap.file;
      return stream
        .pipe(rollup({
          // Function names leak to the global namespace. To avoid that,
          // let's just put everything within an immediate function, this way variables
          // are all beautifully namespaced.
          banner: '(function () {',
          footer: '}());',
          entry: `./tests/src/${fileName}`,
          allowRealFiles: true,
          format: 'umd',
          moduleName: 'flMultiCalendar',
          plugins: [
            // Import modules with jsnext:main
            nodeResolve({	jsnext: true, main: true }),
            // Import node modules
            commonjs(),
            babel({
              exclude: 'node_modules/**',
              presets: ['es2015-rollup'],
            }),
          ],
        }));
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./tests/build'));
});

gulp.task('jasmine', () => {
  return gulp.src([
    'node_modules/babel-polyfill/dist/polyfill.js',
    'node_modules/moment/min/moment.min.js',
    'tests/build/*-specs.js'])
  .pipe(jasmineBrowser.specRunner({ console: true }))
  .pipe(jasmineBrowser.headless());
});

gulp.task('jasmine-debug', () => {
  const filesForTest = ['node_modules/moment/min/moment.min.js', 'tests/build/*-specs.js'];
  gulp.src(filesForTest)
  .pipe(watch(filesForTest))
  .pipe(jasmineBrowser.specRunner())
  .pipe(jasmineBrowser.server({ port: 8888 }));
});

gulp.task('open-jasmine-debug', () => {
  gulp.src(['./'])
  .pipe(open({
    uri: 'http://localhost:8888',
    app: 'google-chrome',
  }));
});

gulp.task('build-docs', ['docs']);

gulp.task('build-tests', ['rollup-tests']);
gulp.task('test-debug', [
  'build-tests',
  'watch',
  'jasmine-debug',
  'open-jasmine-debug',
]);

gulp.task('demo', ['webserver']);
gulp.task('rollup', ['rollup-module']); //'rollup-tests'
gulp.task('build', ['rollup', 'sass', 'assets', 'copy-dependencies']);

gulp.task('dev', ['build', 'watch', 'webserver']);


gulp.task('test', ['rollup-tests', 'jasmine']);
