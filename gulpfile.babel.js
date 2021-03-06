import gulp from 'gulp';
import jasmineNode from 'gulp-jasmine-node';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import rename from 'gulp-rename';
import istanbul from 'gulp-babel-istanbul';
import injectModules from 'gulp-inject-modules';
import coveralls from 'gulp-coveralls';


gulp.task('pre-test', () => {
  return gulp.src('src/*.js')
  // Covering files
  .pipe(istanbul({ includeUntested: true }))
  // Force `require` to return covered files
  .pipe(istanbul.hookRequire());
});

gulp.task('run-tests', ['pre-test'], () => {
  return gulp.src('tests/*.js')
  .pipe(babel({
    presets: ['es2015'],
    plugins: ['transform-object-rest-spread']
  }))
  .pipe(injectModules())
  // Run test assertions with jasmine-node
  .pipe(jasmineNode({
    timeout: 10000,
    includeStackTrace: true,
    color: true
  }))
  .pipe(istanbul.writeReports());
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

gulp.task('serve', ['babelifySrcFiles'], () => {
  nodemon({
    script: 'dist/app.js',
    ext: 'js json html',
    ignore: [
      'node_modules/',
      '.vscode/',
      '/dist',
      '/tests',
      'gulpfile.babel.js'],
    tasks: ['babelifySrcFiles']
  });
});

gulp.task('coverage', ['run-tests'], () => {
  return gulp.src('coverage/lcov.info')
  .pipe(coveralls());
});
