// require('dotenv').config();
var gulp = require('gulp');
var util = require('gulp-util');
var gulpif = require('gulp-if');

// Gulp Plugins
var sourcemaps = require('gulp-sourcemaps');
var eslint = require('gulp-eslint');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var babel = require('gulp-babel');
var htmlmin = require('gulp-htmlmin');

// Browserify stuff
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Live coding dev tools
var nodemon = require('nodemon');
var browserSync = require('browser-sync').create();

var opts = {
  entries: ['./app/client/index.js'],
  debug: true,
  transform: ['babelify'],
};
var w = watchify(browserify(opts));
var b = browserify(opts);

// Add events
w.on('update', watch);
w.on('log', util.log);

function watch() {
  util.log('Compiling JS...');
  return w.bundle()
    .on('error', function(err) {
      util.log(
        util.colors.red('Browserify Error:'),
        err.message,
        err.codeFrame ? '\n\n' + err.codeFrame : ''
      );
      this.emit('end');
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream({once: true}));
}

function bundle() {
  return b.bundle()
    .on('error', util.log.bind(util, 'Browserify Error'))
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulpif((process.env.NODE_ENV === 'develop'), sourcemaps.init({loadMaps: true})))
    .pipe(gulpif((process.env.NODE_ENV === 'production'), uglify()))
    .pipe(gulpif((process.env.NODE_ENV === 'develop'), sourcemaps.write('.')))
    .pipe(gulp.dest('./public'));
}

/**
 * Lint js
 */
gulp.task('lint:js', function() {
  return gulp.src('./app/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('nodemon', function() {
  browserSync.init({
    open: false,
    notify: false,
    proxy: 'http://localhost:3000',
    port: 4000,
  });

  gulp.watch('./styles/**/*.scss',  gulp.series('css'));
  // gulp.watch('./app/**/*.js',  gulp.series('lint:js'));

  return nodemon({
    exec: './node_modules/babel-cli/bin/babel-node.js  --no-babelrc --plugins=transform-es2015-modules-commonjs,transform-async-to-generator,transform-class-properties,transform-export-extensions,transform-function-bind,transform-object-rest-spread',
    script: './app/index.js',
    watch: './app/',
    ignore: './app/client/',
  })

    // .on('start', function onStart() {
    //   setTimeout(function() {
    //     browserSync.reload({stream: false});
    //   }, 500);
    // })

    .on('restart', function onRestart() {
      util.log(
        util.colors.cyan('Server restarted')
      );
    });
});

gulp.task('css', function() {
  return gulp.src('./styles/main.scss')
    .pipe(gulpif((process.env.NODE_ENV === 'develop'), sourcemaps.init({loadMaps: true})))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpif((process.env.NODE_ENV === 'production'), cssnano()))
    .pipe(gulpif((process.env.NODE_ENV === 'develop'), sourcemaps.write('.')))
    .pipe(gulp.dest('./public'))
    .pipe(browserSync.stream());
});

// Server scripts (production only)
gulp.task('js', function() {
  return gulp.src('./app/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('./production'))
});

gulp.task('views', function() {
  return gulp.src('./app/server/views/*.ejs')
    .pipe(htmlmin({
      minifyJS: true,
      minifyCSS: true,
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true,
      removeRedundantAttributes: true,
      sortAttributes: true,
    }))
    .pipe(gulp.dest('./production/server/views/'));
});

gulp.task('default', gulp.series(
  gulp.parallel(
    // 'lint:js',
    'css',
    watch
  ),
  'nodemon'
));

gulp.task('production',
  gulp.parallel(
    bundle,
    'css',
    'js'
  )
);

process.once('SIGINT', function(){
  process.exit(0);
});
