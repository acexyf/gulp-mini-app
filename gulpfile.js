var gulp = require('gulp');
var gulpif = require('gulp-if');
var less = require('gulp-less');
var glob = require("glob");
var rename = require('gulp-rename');

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

    console.log(glob.sync('./pages/**/*.wxml'))
    return gulp.src(glob.sync('./pages/**/*.wxml'), { base: 'pages'})
        .pipe(gulp.dest(`${buildFile}/pages`))
})


gulp.task('watch',function(){
    gulp.watch(glob.sync('./@(app.js|app.json|sitemap.json|project.config.json|app.wxss)'), gulp.series('common-file'))
})




if(isProd){
    gulp.task('default', gulp.series('common-file', 'utils', 'wxml', function(done){
        console.log('prod');
        done()
    }));
} else {

    gulp.task('default', gulp.series('common-file', 'utils', 'watch', function(done){
        console.log('dev');
        done()
    }));
}









