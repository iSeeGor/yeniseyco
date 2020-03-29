let gulp = require('gulp');
let concat = require('gulp-concat');
let rename = require("gulp-rename");
let autoprefixer = require('gulp-autoprefixer');
let cleanCSS = require('gulp-clean-css');
let uglify = require('gulp-uglify');
let del = require('del');
let browserSync = require('browser-sync').create();
let gulpsass = require('gulp-sass');
let sourcemaps = require('gulp-sourcemaps');
let babel = require("gulp-babel");

let jsFileList =  [
    './src/js/lib.js',
    './src/js/main.js'
]

function js() {
    return gulp.src(jsFileList)
        .pipe(concat('script.js'))
        // .pipe(uglify({
        //     //toplevel: true
        // }))
        .pipe(babel())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/js'))
        .pipe(browserSync.stream())    
}

function sass() {
    return gulp.src("./src/sass/*.scss")
        .pipe(sourcemaps.init())
        .pipe(gulpsass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['> 50%', 'last 20 versions', 'Firefox ESR', "Edge 16", 'ie >= 8'],
            cascade: true
        }))
        // .pipe(cleanCSS({
        //     level: 2 //Level: 0, 1, 2
        // }))
        // .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest("./assets/css"))
        .pipe(browserSync.stream())
}

function cssmin(){
    return gulp.src("./assets/css/*.css")
        .pipe(cleanCSS({
            level: 2 //Level: 0, 1, 2
        }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("./assets/css"))
}

function clean() {
    return del(['./assets/css/*.css']) 
}

function watch() {
    browserSync.init({
        // server: {
        //     baseDir: "./"
        // },
        proxy: 'http://yenisey.loc'
    })
    gulp.watch('./src/js/**/*.js', js)
    gulp.watch('./src/sass/**/*.scss', sass)
    gulp.watch("./**/*.php").on('change', browserSync.reload)
    // gulp.watch("./*.html").on('change', browserSync.reload)
}

gulp.task('jscript', js);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('sass', sass);
gulp.task('cssMin', cssmin);

// gulp.task('build', gulp.series(clean, gulp.parallel(sass, js)));
gulp.task('build', gulp.series(clean, gulp.parallel(sass, js), cssmin));
gulp.task('dev', gulp.series('build','watch'));