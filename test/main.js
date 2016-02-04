var gulp = require('gulp');
var should = require('should');
var gulpIf = require('gulp-if');
var through = require('through2');
var fileRev = require('../');

describe('gulp-file-rev', function () {

	it('should append the content hash to filenames', function (done) {
		var revision = fileRev();
		var hashRe = /\.\w{8}(\.\w*$|$)/;

		gulp
			.src(['test/fixtures/*.html', 'test/fixtures/{html,css,js,img}/**/*'])
			.pipe(gulpIf('img/**/*', revision))
			.pipe(gulpIf('img/**/*', through.obj(function (file, enc, cb) {
				hashRe.test(file.relative).should.be.true();
				cb(null, file);
			})))
			.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
			.pipe(gulpIf('**/*.{html,css,js}', through.obj(function (file, enc, cb) {
				var contents = file.contents.toString();
				contents.indexOf('e244ac2d').should.above(0);
				contents.indexOf('7f692ffd').should.above(0);
				contents.indexOf('e3641288').should.above(0);
				cb(null, file);
			}, function () {
				done();
			})));
	});

	it('should put the content hash to query strings', function (done) {
		var revision = fileRev({queryMode: true});
		var hashRe = /\.\w{8}(\.\w*$|$)/;

		gulp
			.src(['test/fixtures/*.html', 'test/fixtures/{html,css,js,img}/**/*'])
			.pipe(gulpIf('img/**/*', revision))
			.pipe(gulpIf('img/**/*', through.obj(function (file, enc, cb) {
				hashRe.test(file.relative).should.be.false();
				cb(null, file);
			})))
			.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
			.pipe(gulpIf('**/*.{html,css,js}', through.obj(function (file, enc, cb) {
				var contents = file.contents.toString();
				contents.indexOf('?v=e244ac2d').should.above(0);
				contents.indexOf('?v=7f692ffd').should.above(0);
				contents.indexOf('?v=e3641288&key=value').should.above(0);
				cb(null, file);
			}, function () {
				done();
			})));
	});

});