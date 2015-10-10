var fs = require('fs'),
	gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	replace = require('gulp-replace'),
	rename = require('gulp-rename'),
	merge = require('merge2'),
	shell = require('gulp-shell'),
	babelify = require('babelify'),
	browserify = require('browserify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream');

var version = fs.readFileSync('./src/Horizon.js', {encoding:'utf8'}).match(/^\/\*\! \w+ ([0-9.]+)/)[1];

// ======================================== gulp version

gulp.task('version', function() {
	var streams = merge();
	streams.push(
		gulp.src( 'package.json' )
			.pipe( replace(/"version": "[0-9.]+",/, '"version": "'+version+'",') )
			.pipe( gulp.dest('.') )
	);
	streams.push(
		gulp.src( 'README.md' )
			.pipe( replace(/^(\w+) [0-9.]+/, '$1 '+version) )
			.pipe( gulp.dest('.') )
	);
	return streams;
});

// ======================================== gulp build

gulp.task('build', function() {
	
	fs.readdirSync('./src/').forEach(function(file) {
		var name = file.substr(0, file.length - 3);
		
		if(name == 'Horizon') {
			return;
		}
		
		browserify('./src/'+file)
			.external('Horizon')
			.bundle()
			.pipe(source(name+'.min.js'))
			.pipe(buffer())
			.pipe(uglify())
			.pipe(gulp.dest('./build/'));
	});
	
	browserify()
		.require('./src/Horizon.js', {expose: 'Horizon'})
		.require('./bower_components/W/W.min.js', {expose: 'W'})
		.transform(babelify)
		.bundle()
		.pipe(source('Horizon.min.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./build/'));
	
});

// ======================================== gulp publish

gulp.task('publish', shell.task([
	'npm publish',
	'jam publish'
]));

// ======================================== gulp

gulp.task('default', ['build']);
