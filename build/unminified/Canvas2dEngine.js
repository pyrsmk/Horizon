(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Register Canvas2D engine
Horizon.registerEngine('canvas2d', function(args) {
	if('easing' in args.properties) {
		args.properties.ease = args.properties.easing;
		delete args.properties.easing;
	}
	else {
		args.properties.ease = args.easing;
	}
	args.properties.onUpdate = function() {
		args.node.scene.redraw = true;
	};
	TweenLite.to(args.node, args.duration, args.properties);
});

// Initialize the engine
Horizon.initCanvas2D = function(scene, images) {
	// Init image objects
	var context = scene.getContext('2d');
	scene.redraw = false;
	for(var i=0, j=images.length; i<j; ++i) {
		images[i].scene = scene;
		images[i].offsetLeft = images[i].left || 0;
		images[i].offsetTop = images[i].top || 0;
		images[i].offsetWidth = 0;
		images[i].offsetHeight = 0;
	}
	// Init drawing routine
	TweenLite.ticker.addEventListener('tick', function() {
		// Redraw or not
		if(!context || !scene.redraw) {
			return;
		}
		scene.redraw = false;
		// Clear the scene
		context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		// Draw images
		for(var i=0, j=images.length; i<j; ++i) {
			// Pre-render image
			if(!('cache' in images[i])) {
				if(!images[i].node.width) {
					continue;
				}
				var c = document.createElement('canvas');
				c.width = images[i].offsetWidth = images[i].naturalWidth = images[i].node.width;
				c.height = images[i].offsetHeight = images[i].naturalHeight = images[i].node.height;
				c.getContext('2d').drawImage(images[i].node, 0, 0);
				images[i].cache = c;
			}
			// Save state
			context.save();
			// Scale image
			if('scale' in images[i]) {
				images[i].offsetWidth = images[i].naturalWidth * images[i].scale.x;
				images[i].offsetHeight = images[i].naturalHeight * images[i].scale.y;
				context.scale(images[i].scale.x, images[i].scale.y);
			}
			// Apply rotation
			if('rotate' in images[i]) {
				var x = images[i].left + (images[i].offsetWidth / 2),
					y = images[i].top + (images[i].offsetHeight / 2);
				context.translate(x, y);
				context.rotate(images[i].rotate * Math.PI / 180);
				context.translate(-x, -y);
			}
			// Apply opacity
			if('opacity' in images[i]) {
				context.globalAlpha = images[i].opacity;
			}
			// Update position
			images[i].offsetLeft = images[i].left || 0;
			images[i].offsetTop = images[i].top || 0;
			// Draw image
			context.drawImage(
				images[i].cache,
				images[i].offsetLeft,
				images[i].offsetTop
			);
			// Restore state
			context.restore();
		}
	});
};
},{}]},{},[1]);
