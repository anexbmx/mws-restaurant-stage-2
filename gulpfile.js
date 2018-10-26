const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const imagemin = require('gulp-imagemin');
const pngquant = require('gulp-pngquant');
let cleanCSS = require('gulp-clean-css');




gulp.task('default', ['scripts', 'copy-files', 'copy-images',
    'styles'], function () {
        gulp.watch('css/**/*.css', ['styles']);
        gulp.watch('js/**/*.js', ['scripts']);
        gulp.watch('./dist/index.html')
            .on('change', browserSync.reload);
        browserSync.init({
            server: './dist',
        });
    });

gulp.task('dist', [
    'scripts-dist',
    'copy-images',
    'styles',
    'copy-files'], 
    function () {
        gulp.watch('css/**/*.css', ['styles']);
        gulp.watch('js/**/*.js', ['scripts-dist']);
        gulp.watch('./dist/index.html')
            .on('change', browserSync.reload);
        browserSync.init({
            server: './dist',
            port: 4008
        });
    });

gulp.task('scripts', function () {
    gulp.src([
        'js/idb.js',
        'js/dbhelper.js',
        'js/main.js'
        ])
        .pipe(babel({
            presets: ["@babel/preset-env"],
        }))
        .pipe(concat('bundle.min.js'))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/js'));

    gulp.src([
        'js/idb.js',
        'js/dbhelper.js',
        'js/restaurant_info.js'
    ])
        .pipe(babel({
            presets: ["@babel/preset-env"],
        }))
        .pipe(concat('bundle_restaurant.min.js'))
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/js'));
});

gulp.task('scripts-dist', function () {
    gulp.src([
        'js/idb.js',
        'js/dbhelper.js',
        'js/main.js'
    ])
        .pipe(babel({
            presets: ["@babel/preset-env"],
        }))
        .pipe(concat('bundle.min.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/js'));

    gulp.src([
        'js/idb.js',
        'js/dbhelper.js',
        'js/restaurant_info.js'
    ])
        .pipe(babel({
            presets: ["@babel/preset-env"],
        }))
        .pipe(concat('bundle_restaurant.min.js'))
        .pipe(uglify())
        .on('error', function (err) {
            gutil.log(gutil.colors.red('[Error]'), err.toString());
        })
        .pipe(gulp.dest('dist/js'));
});

gulp.task('styles', function () {
    gulp.src('css/**/*.css')
        .pipe(cleanCSS())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
        }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('compress', function () {
    return gulp.src('img/*')
        .pipe(imagemin({
            progressive: true,
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/img'));
});


gulp.task('copy-images', function () {
    gulp.src('img/*')
        .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-files', function () {
    gulp.src(['./index.html', './restaurant.html','./manifest.json','./sw.js','./favicon.ico'])
        .pipe(gulp.dest('./dist'));
});



