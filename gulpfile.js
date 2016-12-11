const gulp = require('gulp');

const sourcemaps = require('gulp-sourcemaps');

const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

const babel = require('gulp-babel');
const uglify = require('gulp-uglify');

const browserSync = require('browser-sync').create();

// Copy static files to dist folder
gulp.task('copy', () => {
  gulp.src(['app/**/*', '!app/**/*.js', '!app/**/*.sass'])
    .pipe(gulp.dest('dist'));
});

// SASS compilation and minification

gulp.task('sass', () => {
  gulp.src('app/sass/main.sass')
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: 'last 5 versions' }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});

// JS compilation and minification

gulp.task('js', () => {
  gulp.src('app/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.reload({ stream: true }));
});

// Compile everything at once
gulp.task('build', ['copy', 'sass', 'js']);

// Watching

gulp.task('watch', ['build'], () => {
  gulp.watch(['app/**/*', '!app/**/*.sass', '!app/**/*.js'], ['copy']);
  gulp.watch('app/**/*.sass', ['sass']);
  gulp.watch('app/**/*.js', ['js']);
});

// Serving

gulp.task('serve', () => {
  browserSync.init({
    server: {
      baseDir: 'dist',
    },
  });
  gulp.watch(
    ['app/**/*.html'],
    browserSync.reload
  );
});

gulp.task('default', ['watch', 'serve']);
