var gulp = require('gulp');
var should = require('should');
var gulpIf = require('gulp-if');
var through = require('through2');
var fileRev = require('../');

var hashRe = /\.\w{8}(\.\w*$|$)/;

describe('gulp-file-rev', function () {

	it('should append the content hash to filenames', function (done) {
		var revision = fileRev();

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
				contents.indexOf('img/avatar1.e244ac2d.jpg').should.above(0);
				contents.indexOf('img/avatar2.7f692ffd.jpg').should.above(0);
				contents.indexOf('img/avatar3.e3641288.jpg?key=value').should.above(0);
				cb(null, file);
			}, function () {
				done();
			})));
	});

	it('should put the content hash to query strings', function (done) {
		var revision = fileRev({queryMode: true});

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
				contents.indexOf('img/avatar1.jpg?v=e244ac2d').should.above(0);
				contents.indexOf('img/avatar2.jpg?v=7f692ffd').should.above(0);
				contents.indexOf('img/avatar3.jpg?v=e3641288&key=value').should.above(0);
				cb(null, file);
			}, function () {
				done();
			})));
	});

	it('should prepend the cdn prefix', function (done) {
		var cdnPrefix = 'http://www.cdn.com/';
		var revision = fileRev({
			cwd: 'test/fixtures/',
			prefix: cdnPrefix
		});

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
				contents.indexOf(cdnPrefix + 'img/avatar1.e244ac2d.jpg').should.above(0);
				contents.indexOf(cdnPrefix + 'img/avatar2.7f692ffd.jpg').should.above(0);
				contents.indexOf(cdnPrefix + 'img/avatar3.e3641288.jpg?key=value').should.above(0);
				cb(null, file);
			}, function () {
				done();
			})));
	});

});