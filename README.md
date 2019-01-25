# gulp-file-rev · [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Version][version-image]][version-url] [![License][license-image]][license-url]

> A gulp plugin to revise files and replace references with new paths.

## Usage

First, install `gulp-file-rev` as a development dependency:

```shell
npm install --save-dev gulp-file-rev
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

The prefix to prepended to the file path, which is usually used to prepend the CDN host. *Please notice that you should set `options.cwd` properly.*

Type: `String`

Default: ``

##### options.cwd

Current working directory for prefix prepending, only has an effect if `options.prefix` is provided.

Type: `String`

Default: `process.cwd()`

[build-url]: https://circleci.com/gh/Lanfei/gulp-file-rev
[build-image]: https://img.shields.io/circleci/project/github/Lanfei/gulp-file-rev.svg
[coverage-url]: https://codecov.io/github/Lanfei/gulp-file-rev
[coverage-image]: https://img.shields.io/codecov/c/github/Lanfei/gulp-file-rev.svg
[version-url]: https://npmjs.org/package/gulp-file-rev
[version-image]: https://img.shields.io/npm/v/gulp-file-rev.svg
[license-url]: https://github.com/Lanfei/gulp-file-rev/blob/master/LICENSE
[license-image]: https://img.shields.io/npm/l/gulp-file-rev.svg
