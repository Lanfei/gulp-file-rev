var gulp = require('gulp');
var should = require('should');
var gulpIf = require('gulp-if');
var through = require('through2');
var fileRev = require('../');

describe('gulp-file-rev', function () {

	it('should append the content hash to filenames', function (done) {
		var revision = fileRev();
		var imgRe = /\.(jpg|png|gif)$/;
		var hashRe = /\.\w{8}(\.\w*$|$)/;

		gulp
			.src(['test/fixtures/*.html', 'test/fixtures/{html,css,js,img}/**/*'])
			.pipe(gulpIf('img/**/*', revision))
			.pipe(through.obj(function (file, enc, cb) {
				if (imgRe.test(file.relative)) {
					hashRe.test(file.relative).should.be.true();
				}
				cb(null, file);
			}))
			.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
			.pipe(through.obj(function (file, enc, cb) {
				if (!imgRe.test(file.relative)) {
					var contents = file.contents.toString();
					contents.indexOf('e244ac2d').should.above(0);
					contents.indexOf('7f692ffd').should.above(0);
					contents.indexOf('e3641288').should.above(0);
				}
				cb(null, file);
			}, function () {
				done();
			}));
	});

});