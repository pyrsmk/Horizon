var fs = require('fs'),
	gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	merge = require('merge2'),
	shell = require('gulp-shell'),
	browserify = require('browserify'),
	through2 = require('through2');

var version = fs.readFileSync('./src/Horizon.js', {encoding:'utf8'}).match(/^\/\*\! \w+ ([0-9.]+)/)[1];

// ======================================== gulp version

gulp.task('version', function() {
	var streams = merge();
	
	streams.add(
		gulp.src( 'package.json' )
			.pipe( replace(/"version": "[0-9.]+",/, '"version": "'+version+'",') )
			.pipe( gulp.dest('.') )
	);
	
	streams.add(
		gulp.src( 'README.md' )
			.pipe( replace(/^(\w+) [0-9.]+/, '$1 '+version) )
			.pipe( gulp.dest('.') )
	);
	
	return streams;
});

// ======================================== gulp build

gulp.task('build', ['version'], function() {
	var streams = merge();
	
	fs.readdirSync('./src/').forEach(function(file) {
		var name = file.substr(0, file.length - 3);
		
		if(name == 'Horizon') {
			return;
		}
		
		streams.add(
			gulp.src( './src/'+file )
				.pipe( through2.obj(function(file, enc, next) {
					browserify(file.path).bundle(function(err, res) {
						file.contents = res;
						next(null, file);
					});
				}) )
				.pipe( gulp.dest('./build/unminified/') )
				.pipe( uglify() )
				.pipe( rename(name+'.min.js') )
				.pipe( gulp.dest('./build/minified/') )
		);
	});
	
	streams.add(
		gulp.src( './src/Horizon.js' )
			.pipe( through2.obj(function(file, enc, next) {
				var b = browserify(file.path, {standalone: 'Horizon'});

				b.bundle(function(err, res) {
					file.contents = res /*Buffer.concat([
						res,
						new Buffer('window.Horizon = new Horizon();', 'utf-8')
					])*/;
					next(null, file);
				});
			}) )
			.pipe( gulp.dest('./build/unminified/') )
			.pipe( uglify() )
			.pipe( rename('Horizon.min.js') )
			.pipe( gulp.dest('./build/minified/') )
	);
	
	return streams;
});

// ======================================== gulp publish

gulp.task('publish', shell.task([
	"git tag -a "+version+" -m '"+version+"'",
	'git push --tags',
	'npm publish'
]));

// ======================================== gulp

gulp.task('default', ['build']);
