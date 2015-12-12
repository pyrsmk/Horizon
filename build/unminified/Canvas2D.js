(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Horizon._registerPlugin('canvas2d', function() {
	// Override canvas2d()
	Horizon.__proto__.canvas2d = function(scene, images) {
		// Get context
		var canvas2d = scene.getContext('2d');
		// Animation loop
		TweenLite.ticker.addEventListener('tick', function() {
			// Clear the scene
			canvas2d.clearRect(0, 0, canvas2d.canvas.width, canvas2d.canvas.height);
			// Draw images
			for(var i=0, j=images.length; i<j; ++i) {
				// Get out!
				if(!images[i] || typeof images[i] != 'object' || !('nodeName' in images[i]) || images[i].nodeName != 'IMG') {
					continue;
				}
				// Save state
				canvas2d.save();
				// Invalid
				if(!('canvas2d' in images[i])) {
					continue;
				}
				// Scale image
				if('scale' in images[i].canvas2d) {
					canvas2d.scale(images[i].canvas2d.scale.x, images[i].canvas2d.scale.y);
				}
				// Apply rotation
				if('rotation' in images[i].canvas2d) {
					var x = images[i].canvas2d.left + (images[i].width / 2),
						y = images[i].canvas2d.top + (images[i].height / 2);
					canvas2d.translate(x, y);
					canvas2d.rotate(images[i].canvas2d.rotation * Math.PI / 180);
					canvas2d.translate(-x, -y);
				}
				// Apply opacity
				if('opacity' in images[i].canvas2d) {
					canvas2d.globalAlpha = images[i].canvas2d.opacity;
				}
				// Draw image
				canvas2d.drawImage(
					images[i],
					images[i].canvas2d.left,
					images[i].canvas2d.top
				);
				// Restore state
				canvas2d.restore();
			}
		});
	};
});

Horizon.initPlugin('canvas2d');
},{}]},{},[1]);
