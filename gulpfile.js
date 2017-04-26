import gulp from 'gulp';
import jasmine from 'gulp-jasmine';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';

gulp.task('run-tests', () => {
  gulp
  .src('tests/inverted-index-test.js')
  .pipe(jasmine());
});

gulp.task('babel', () => {
  gulp.src('src/inverted-index.js')
  .pipe(babel({
    presets: ['es2015']
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('serve', () => {
  nodemon({
    script: 'dist/',
    ext: 'js json',
    ignore: ['gulpfile.js', 'node_modules/'],
    tasks: ['babel']
  });
});
