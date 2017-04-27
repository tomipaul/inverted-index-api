import gulp from 'gulp';
import jasmineNode from 'gulp-jasmine-node';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import rename from 'gulp-rename';

gulp.task('run-tests', ['babelifyTestFiles'], () => {
  gulp.src('spec/*.js')
  .pipe(jasmineNode({
    timeout: 10000,
    includeStackTrace: true,
    color: true
  }));
});

gulp.task('babelifyTestFiles', () => {
  const toCamelCaseSpec = (filename) => {
    const replaceFunc = (match, p) => {
      return String.prototype.toUpperCase.call(p);
    };
    return String.prototype.replace.call(filename, /-([a-z])/g, replaceFunc);
  };
  gulp.src('tests/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(rename((path) => {
    path.basename = `${toCamelCaseSpec(path.basename)}Spec`;
  }))
  .pipe(gulp.dest('spec'));
});

gulp.task('babelifySrcFiles', () => {
  gulp.src('src/*.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
  nodemon({
    script: 'dist/app.js',
    ext: 'js json',
    ignore: ['node_modules/', '.vscode/'],
    tasks: ['babelifySrcFiles']
  });
});
