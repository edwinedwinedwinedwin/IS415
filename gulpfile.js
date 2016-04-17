var gulp  = require('gulp'),
    gutil = require('gulp-util');
//sass dependecy
var sass = require('gulp-sass');



// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

//hello task
gulp.task('hello', function(){

	console.log('Hello asd');
});
	


//sass function to convert sass to css
gulp.task('sass', function() {
  return gulp.src('www/sass/**/*.scss') // Gets all files ending with .scss in app/scss
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('app/sass/**/*.scss', ['sass']); 
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/js/**/*.js', browserSync.reload); 
  gulp.watch('app/css/**/*.css', browserSync.reload); 
});


var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});



