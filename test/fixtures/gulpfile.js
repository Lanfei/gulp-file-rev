var gulp = require('gulp');
var gulpIf = require('gulp-if');
var fileRev = require('../../');

gulp.task('default', function () {
	var revision = fileRev();

	return gulp
		.src(['*.html', '{html,css,js,img}/**/*'])
		.pipe(gulpIf('**/*.{jpg,png,gif}', revision))
		.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
		.pipe(gulp.dest('build'));
});
