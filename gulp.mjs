import gulp from 'gulp';
import brotli from 'gulp-brotli';
import htmlmin from 'gulp-htmlmin';

gulp.task('gh-pages', () => {
  return gulp.src('./src/404.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/browser'));
});

gulp.task('compress-brotli', () => {
  return gulp.src(['./dist/**/*.*'])
    .pipe(brotli())
    .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', gulp.series('gh-pages', 'compress-brotli'));
