'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')

gulp.task('sass', () => {
  return gulp.src('scss/app.scss')
    .pipe(sass.sync({
      includePaths: ['node_modules/'],
      outputStyle: 'compressed'},
    ).on('error', sass.logError))
    .pipe(gulp.dest('src/dist'))
})
