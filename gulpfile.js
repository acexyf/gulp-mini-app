var gulp = require('gulp');
var gulpif = require('gulp-if');


//环境变量
var env = process.env.NODE_ENV || 'prod';
var isProd = env === 'prod';
var buildFile = '../build';



gulp.task('common-file',function(){
    return gulp.src(['./app.js','./app.json','./project.config.json', './sitemap.json', './app.wxss'])
            .pipe(gulp.dest(`${buildFile}`))
})




gulp.task('watch',function(){
    gulp.watch('./app.js', gulp.series('common-file'))
})



if(isProd){
    gulp.task('default', gulp.series('common-file', function(done){
        console.log('prod');
        done()
    }));
} else {



    gulp.task('default', gulp.series('common-file','watch', function(done){
        console.log('dev');
        done()
    }));
}









