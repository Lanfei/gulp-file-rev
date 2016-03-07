# gulp-file-rev [![NPM version][npm-image]][npm-url]

> A gulp plugin to revise files and replace references with new paths.

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
		// revise files
		.pipe(gulpIf('**/*.{jpg,png,gif}', revision))
		// replace references
		.pipe(gulpIf('**/*.{html,css,js}', revision.replace))
		.pipe(gulp.dest('dist'));
});
```

## API

### fileRev(options)

#### options

Type: `Object`

##### options.hashLength

The length of the hash.

Type: `Number`

Default: `8`

##### options.separator

The separator between the filename and hash.

Type: `String`

Default: `.`

##### options.algorithm

The algorithm function to calculate the content hash.

Type: `Function`

Default: `fileRev.md5`

##### options.queryMode

If `true`, the plugin will put the hash to the query string instead of the filename.

Type: `Boolean`

Default: `false`

##### options.prefix

The prefix to prepended to the file path.

Type: `String`

Default: ``

##### options.cwd

Current working directory for prefix prepending, only has an effect if `options.prefix` is provided.

Type: `String`

Default: `process.cwd()`

[npm-url]: https://npmjs.org/package/gulp-file-rev
[npm-image]: https://badge.fury.io/js/gulp-file-rev.svg
