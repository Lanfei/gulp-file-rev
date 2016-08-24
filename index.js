'use strict';

var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var gutil = require('gulp-util');
var through = require('through2');

var PLUGIN_NAME = 'gulp-file-rev';

var FILENAME_RE = /([^\/\.]+)(\.\w*$)/;
var ASSETS_RE = /(['"( ])([^'":# \(\)\?]+\.[\w_]+)(['")?# ])/g;

function revision(opts, manifest, file) {
	var separator = opts['separator'] || '.';
	var hashLength = opts['hashLength'] || 8;
	var algorithm = opts['algorithm'] || md5;
	var queryMode = opts['queryMode'] || false;

	var replacement;
	var absolute = file.path;
	var relative = file.relative;
	var hash = md5(file.contents, hashLength);

	if (queryMode) {
		replacement = '$1' + '$2?v=' + hash;
		manifest[absolute] = file.path.replace(FILENAME_RE, replacement);
	} else {
		replacement = '$1' + separator + hash + '$2';
		manifest[absolute] = file.path.replace(FILENAME_RE, replacement);
		file.path = manifest[absolute];
	}

	gutil.log(
		PLUGIN_NAME + ': Revise',
		gutil.colors.green(relative), '->',
		gutil.colors.green(file.relative)
	);
	return file;
}

function replace(opts, manifest, file, enc) {
	var cwd = opts['cwd'] || process.cwd();
	var prefix = opts['prefix'] || '';
	var queryMode = opts['queryMode'] || false;

	var base = file.base;
	var relative = file.relative;
	var dirname = path.dirname(file.path);
	var codes = file.contents.toString(enc);

	codes = codes.replace(ASSETS_RE, function (match, openChar, filename, closeChar) {

		function replaceBy(base) {
			var oldPath;
			var newPath;
			var newFilename;
			oldPath = path.join(base, filename);
			newPath = manifest[oldPath];
			if (newPath) {
				if (prefix) {
					newFilename = prefix + path.relative(cwd, newPath);
				} else {
					newFilename = path.relative(base, newPath);
				}
				gutil.log(
					PLUGIN_NAME + ': Replace',
					gutil.colors.green(filename), '->',
					gutil.colors.green(newFilename),
					'(' + relative + ')'
				);
				return openChar + newFilename + closeChar;
			}
			return null;
		}

		if (queryMode && closeChar === '?') {
			closeChar = '&';
		}

		return replaceBy(base) || replaceBy(dirname) || match;
	});

	file.contents = new Buffer(codes);
	return file;
}

function md5(data, hashLength) {
	var md5 = crypto.createHash('md5');
	return md5.update(data).digest('hex').slice(0, hashLength);
}

function fileRev(opts) {
	opts = opts || {};

	var cache = [];
	var manifest = {};

	var fileRev = through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			return cb();
		} else if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		} else if (file.isBuffer()) {
			cb(null, revision(opts, manifest, file));
		}
	});

	fileRev.replace = through.obj(function (file, enc, cb) {
		if (file.isNull()) {
			return cb();
		} else if (file.isStream()) {
			cb(new gutil.PluginError(PLUGIN_NAME, 'Streaming not supported'));
		} else if (file.isBuffer()) {
			cache.push({
				file: file,
				enc: enc
			});
			cb();
		}
	}, function (cb) {
		while (cache.length) {
			var item = cache.shift();
			this.push(replace(opts, manifest, item.file, item.enc));
		}
		cb();
	});

	fileRev.manifest = manifest;

	return fileRev;
}

exports = module.exports = fileRev;
exports.md5 = md5;
