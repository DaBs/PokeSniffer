'use strict';

import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import sourcemaps from 'gulp-sourcemaps';
import vueify from 'vueify';
import babelify from 'babelify';
import through from 'through';
import globby from 'globby';
import browserSync from 'browser-sync';
import browserSyncSpa from 'browser-sync-middleware-spa';
import plumber from 'gulp-plumber';
import debug from 'gulp-debug';
import sass from 'gulp-sass';
import fs from "fs";
import through2 from "through2";
import path from "path";
import gIf from 'gulp-if';
import imagemin from 'gulp-imagemin';
import cache from 'gulp-cache';


const reload = browserSync.reload;

vueify.compiler.applyConfig({
  autoprefixer: {
    browsers: ['last 2 versions']
  }
});


gulp.task('serve', () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: ['./www'],
      serveStatic: ['./www'],
      middleware: [
        browserSyncSpa(/^[^\.]+$/, __dirname + '/www/index.html'),
      ],
      https: true
    }
  });
});

gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('www/'))
    .pipe(browserSync.stream());
});

gulp.task('fonts', () => {
  return gulp.src('src/fonts/*')
    .pipe(gulp.dest('www/fonts/'))
    .pipe(reload({stream: true}));
});

gulp.task('images', () => {
  return gulp.src('src/images/**/*')
    .pipe(gIf(gIf.isFile, cache(imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('www/images'))
    .pipe(browserSync.stream());
});

gulp.task('scss', () => {
  return gulp.src('./src/scss/shell.scss')
    .pipe(gulpSassGlobbing())
    .pipe(sass({

    }))
      .on('error', gutil.log)
    .pipe(gulp.dest('www/styles'))
    .pipe(browserSync.stream());
});

gulp.task('javascript', () => {

  const bundledStream = through();

  bundledStream
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    /*.pipe(uglify())
      .on('error', gutil.log)*/
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./www/js'))
    .pipe(reload({stream: true}));

  globby(['./src/**/*.vue', './src/main.js']).then(function(entries) {
    const b = browserify({
      entries: entries,
      debug: true,
      transform: [vueify, babelify]
    });

    b.on('update', function() {
      b.bundle().pipe(bundledStream);
    });
    b.bundle().pipe(bundledStream);
  }).catch(function(err) {
    bundledStream.emit('error', err);
  });

  gulp.src('./src/vendor/**/*.js')
    .pipe(gulp.dest('./www/js/vendor'));

  return bundledStream;
});

gulp.task('watch', () => {
  gulp.watch(['./src/**/*.vue', './src/**/*.js'], ['javascript']);
  gulp.watch(['./src/scss/**/*.scss'], ['scss']);
  gulp.watch(['./src/images/**/*'], ['images']);
  gulp.watch(['./src/fonts/**/*'], ['fonts']);
  gulp.watch(['./src/*.html'], ['html']);
});

gulp.task('default', ['html', 'images', 'fonts', 'scss', 'javascript', 'watch', 'serve']);



function gulpSassGlobbing () {
  function process (filename, isSass) {
    if(fs.statSync(filename).isDirectory() || !path.extname(filename).match(/\.sass|\.scss/i)) {
      return '';
    }

    filename = filename.replace(/\\/g, '/');

    return '@import "' + filename + '"' + (isSass ? '' : ';') + '\n'
  }

  function transform (file, env, callback) {
    var contents = file.contents.toString('utf-8');
    var reg = /@import\s+[\"']([^\"']*\*[^\"']*)[\"']/;
    var isSass = path.extname(file.path) === '.sass';

    var result;

    while((result = reg.exec(contents)) !== null) {
      var index = result.index;
      var sub = result[0];
      var globName = result[1];

      var files = globby.sync(file.base + globName);
      var replaceString = '';

      files.forEach(function (filename) {
        if(filename !== file.path) {
          replaceString += process(filename, isSass);
        }
      });

      contents = contents.replace(sub, replaceString);
    }

    file.contents = new Buffer(contents);
    callback(null, file);
  };

  return through2.obj(transform);
}
