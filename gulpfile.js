const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const plumber = require('gulp-plumber');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('node-sass'));
const changed = require('gulp-changed');
const fileinclude = require('gulp-file-include');
const server = require('browser-sync').create();
const rollup = require('gulp-rollup');

const paths = {
  src: './src/',
  srcJS: './src/app/**/*.js',
  srcCSS: './src/scss/*.scss',
  watchCSS: './src/**/**/*.scss',
  srcHTML: './src/app/**/*.html',
  srcIndex: './src/app/index.html',
  srcAssets: './src/assets/**/*',
  dest: './dest/',
  destJS: './dest/js/',
  destCSS: './dest/css/',
  destAssets: './dest/assets/',
};

async function reload() {
  server.reload();
}

// SASS Compile
const sassCompile =() => {
  return gulp.src(paths.srcCSS)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destCSS)); 
};

// Watch SASS
gulp.task('watch-scss', gulp.series(() => {
  return gulp.watch(paths.watchCSS, gulp.series(sassCompile, reload));
}));

// JS Compile
const compileJS = () => {
  /* return gulp.src(paths.srcJS, {
      sourcemaps: true
    })
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(concat('index.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destJS)); */ 

  return gulp.src(paths.srcJS)
    .pipe(sourcemaps.init())
    
    .pipe(rollup({
      input: './src/app/index.js',
      output: {
        format: 'esm'
      }
    }))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.destJS));
};

// Watch JS
gulp.task('watch-js', gulp.series(() => {
  return gulp.watch(paths.srcJS, gulp.series(compileJS, reload));
}));

// include HTML
const htmlInclude = () => {
  return gulp.src([
    paths.srcIndex
    ])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(paths.dest));
};

// Watch HTML
gulp.task('watch-html', gulp.series(() => {
  return gulp.watch(paths.srcHTML, gulp.series(htmlInclude, reload));
}));

// Move Assets
const moveAssets = () => {
  return gulp.src(paths.srcAssets)
    .pipe(changed(paths.destAssets))
    .pipe(gulp.dest(paths.destAssets));
};

// Watch Assets
gulp.task('watch-assets', gulp.series(() => {
  return gulp.watch(paths.srcAssets, gulp.series(moveAssets, reload));
}));

// Watch all files
gulp.task('watch-all', gulp.parallel('watch-scss', 'watch-js', 'watch-html', 'watch-assets'));

const init = () => {
  server.init({
    server: {
      baseDir: paths.dest
    }
  });
  sassCompile();
  compileJS();
  htmlInclude();
  moveAssets(paths.srcAssets);
  server.reload();
};

gulp.task('start', gulp.parallel(init, 'watch-all'));

