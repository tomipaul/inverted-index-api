import gulp from 'gulp';
import jasmineNode from 'gulp-jasmine-node';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import istanbul from 'gulp-istanbul';
import coveralls from 'gulp-coveralls';

gulp.task('pre-test', () => {
  return gulp.src('dist/*.js')
  // Covering files
  .pipe(istanbul({ includeUntested: true }))
  // Force `require` to return covered files
  .pipe(istanbul.hookRequire());
});

gulp.task('run-tests', ['pre-test'], () => {
  return gulp.src('spec/*.js')
  // Run test assertions with jasmine-node
  .pipe(jasmineNode({
    timeout: 10000,
    includeStackTrace: true,
    color: true
  }));
});

gulp.task('babelifyTestFiles', () => {
  // rename test file to match /spec\.js$/i
  const renameTestFile = (filename) => {
    const replaceFunc = (match, p) => {
      return String.prototype.toUpperCase.call(p);
    };
    return String.prototype.replace.call(filename, /-([a-z])/g, replaceFunc);
  };
  return gulp.src('tests/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(rename((path) => {
    path.basename = `${renameTestFile(path.basename)}Spec`;
  }))
  .pipe(gulp.dest('spec'));
});

gulp.task('babelifySrcFiles', () => {
  return gulp.src('src/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
  nodemon({
    script: 'dist/app.js',
    ext: 'js json',
    ignore: [
      'node_modules/',
      '.vscode/',
      '/test',
      '/spec',
      'gulpfile.babel.js'],
    tasks: ['babelifySrcFiles']
  });
});

gulp.task('coverage', ['run-tests'], () => {
  return gulp.src('spec/*.js')
  .pipe(istanbul.writeReports())
  .on('end', () => {
    gulp.src('coverage/lcov.info')
    .pipe(coveralls());
  });
});
