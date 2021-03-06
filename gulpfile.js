var gulp = require('gulp'),
	shell = require('gulp-shell'),
    name = __dirname.match(/\\([^\\]*)$/)[1],
    version = require('./package.json').version;

// ======================================== gulp version

gulp.task('version', function() {
	var replace = require('gulp-replace');
    
	return gulp.src( './README.md' )
        .pipe( replace(/^([\w-]+) [0-9.]+/, '$1 ' + version) )
        .pipe( gulp.dest('.') );
    
});

// ======================================== gulp lint

gulp.task('lint', function() {
    var lint = require('gulp-eslint'),
        flow = require('gulp-flowtype');
    
	return gulp.src( './src/*' )
        .pipe( flow() )
		.pipe( lint({
            rules: {
                "array-bracket-spacing": [2, "never"],
                "block-scoped-var": 2,
                "camelcase": 1,
                "computed-property-spacing": [2, "never"],
                "curly": 2,
                "max-depth": [1, 3],
                "max-statements": [1, 30],
                "new-cap": 1,
                "no-extend-native": 2,
                "no-use-before-define": [2, "nofunc"],
                "quotes": [2, "single", "avoid-escape"],
                "semi": [2, "always"],
                "space-unary-ops": 2
            }
        }) )
        .pipe( lint.format() );

});

// ======================================== gulp build

gulp.task('build', ['version', 'lint'], function() {
    var concat = require('gulp-concat'),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        umd = require('gulp-umd'),
        add = require('gulp-add-src'),
        resolve = require('resolve'),
        _ = require('lodash');
    
	return gulp.src( './src/Horizon.js' )
                .pipe( umd({
                    template: './node_modules/umd-templates/patterns/returnExportsGlobal.js',
                    namespace: function() {
                        return name;
                    }
                }) )
                .pipe( add.append([
                    './src/GsapRenderer.js',
                    './src/Canvas2dRenderer.js',
                    './src/ScrollInput.js',
                    './src/WheelInput.js',
                    './src/MouseInput.js',
                    './src/SwipeInput.js',
                    './src/GyroscopeInput.js'
                ]) )
                .pipe( add.prepend([
                    './node_modules/pyrsmk-w/W.min.js',
                    './node_modules/gsap/src/uncompressed/TweenLite.js',
                    './node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js',
                    './node_modules/gsap/src/uncompressed/easing/EasePack.js',
                    './node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js',
                    './node_modules/impetus/dist/impetus.js'
                ]) )
                .pipe( concat(name + '.js') )
                .pipe( gulp.dest('./lib/') )
				.pipe( uglify() )
				.pipe( rename(name + '.min.js') )
				.pipe( gulp.dest('./lib/') );
});

// ======================================== gulp publish

gulp.task('publish', shell.task([
	"git tag -a " + version + " -m '" + version + "'",
	'git push --tags',
	'npm publish'
]));

// ======================================== gulp

gulp.task('default', ['build']);
