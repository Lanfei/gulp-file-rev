# gulp-file-rev [![NPM version][npm-image]][npm-url]

> A gulp plugin to append the content hash to filenames.

## Usage

First, install `gulp-file-rev` as a development dependency:

```shell
$ npm install --save-dev gulp-file-rev
```

Then, add it to your `gulpfile.js`:

```js
var gulp = require('gulp');
var gulpIf = require('gulp-if');
var fileRev = require('gulp-file-rev');

gulp.task('default', function() {
	var revision = fileRev();

	return gulp
		.src('**/*')
		.pipe(gulpIf('**/*.{jpg,png,gif}', revision))
		.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
		.pipe(gulp.dest('build'));
});
```

## API

### fileRev(options)

#### options

Type: `Object`

##### options.hashLength

The length of the hash.

Type `Number`

Default: `8`

##### options.separator

The separator between the filename and hash.

Type `String`

Default: `.`

#### fileRev.replace

A gulp stream to replace references to renamed files.

[npm-url]: https://npmjs.org/package/gulp-file-rev
[npm-image]: https://badge.fury.io/js/gulp-file-rev.svg
