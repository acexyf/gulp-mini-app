var gulp = require('gulp');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var glob = require("glob");
var rename = require('gulp-rename');

var sass = require('gulp-sass');

sass.compiler = require('node-sass');


//环境变量
var env = process.env.NODE_ENV || 'prod';

var isProd = env === 'prod';

var buildFile = '../build';



gulp.task('common-file',function(){
    return gulp.src(glob.sync('./@(app.js|app.json|sitemap.json|project.config.json|app.wxss)'))
            .pipe(gulp.dest(`${buildFile}`))
})

gulp.task('utils', function(){
    return gulp.src(glob.sync('./utils/*.*'))
            .pipe(gulp.dest(`${buildFile}/utils`))
})

gulp.task('wxml', function(){
    return gulp.src(glob.sync('./pages/**/*.wxml'), { base: 'pages'})
        .pipe(gulp.dest(`${buildFile}/pages`))
})
gulp.task('js', function(){
    return gulp.src(glob.sync('./pages/**/*.js'), { base: 'pages'})
        .pipe(gulp.dest(`${buildFile}/pages`))
})
gulp.task('json', function(){
    return gulp.src(glob.sync('./pages/**/*.json'), { base: 'pages'})
        .pipe(gulp.dest(`${buildFile}/pages`))
})
gulp.task('wxss', function(){
    return gulp.src(glob.sync('./pages/**/*.wxss'), { base: 'pages'})
        .pipe(gulp.dest(`${buildFile}/pages`))
})
gulp.task('sass', function(){
    return gulp.src(glob.sync('./pages/**/*.scss'), { base: 'pages'})
    .pipe(sass().on('error', sass.logError))
    .pipe(rename(function(path){
        path.extname = ".wxss";
    }))
    .pipe(gulp.dest(`${buildFile}/pages`))
})

gulp.task('watch',function(){
    gulp.watch(glob.sync('./@(app.js|app.json|sitemap.json|project.config.json|app.wxss)'), gulp.series('common-file'))
    gulp.watch(glob.sync('./utils/*.*'), gulp.series('utils'))
    gulp.watch(glob.sync('./pages/**/*.wxml'), gulp.series('wxml'))
    gulp.watch(glob.sync('./pages/**/*.js'), gulp.series('js'))
    gulp.watch(glob.sync('./pages/**/*.json'), gulp.series('json'))
    gulp.watch(glob.sync('./pages/**/*.wxss'), gulp.series('wxss'))
    gulp.watch(glob.sync('./pages/**/*.scss'), gulp.series('sass'))
})




if(isProd){
    gulp.task('default', gulp.series('common-file', 'utils', 'wxml', 'js', 'sass', 'wxss', 'json', function(done){
        console.log('prod');
        done()
    }));
} else {

    gulp.task('default', gulp.series('common-file', 'utils', 'wxml', 'js', 'sass', 'wxss', 'json', 'watch', function(done){
        console.log('dev');
        done()
    }));
}









