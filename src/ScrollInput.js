require('../node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js');

var disableRendering = false;

Horizon._registerInput('scroll', {
	constructor: function(horizon, options) {
		// Define rendering function
		var render = function() {
			var x, y;
			// Define x/y coords
			if(horizon.getScene() === document) {
				x = window.pageXOffset ||
					('documentElement' in document ? document.documentElement.scrollLeft : 0) ||
					('body' in document ? document.body.scrollLeft : 0);
				y = window.pageYOffset ||
					('documentElement' in document ? document.documentElement.scrollTop : 0) ||
					('body' in document ? document.body.scrollTop : 0);
			}
			else {
				x = horizon.getScene().scrollLeft;
				y = horizon.getScene().scrollTop;
			}
			// Render
			horizon.render({
				trigger: 'scroll',
				caller: 'scroll',
				x: x,
				y: y,
				duration: 500
			});
		};
		// Listen to scroll event
		Horizon._listen(['scroll'], horizon.getScene(), function(e) {
			if(!disableRendering) {
				Horizon._requestAnimationFrame(render);
			}
		});
	},
	setter: function(horizon, coords) {
		// Avoid rendering when setting scroll position
		disableRendering = true;
		// Get scene
		var scene = horizon.getScene();
		if(scene === document) {
			scene = window;
		}
		// Set scroll position
		TweenLite.to(scene, 0.01, {
			scrollTo: coords,
			onComplete: function() {
				// Avoid scroll event because the browser seems to continue to trigger it for some time
				setTimeout(function() {
					// Re-enable rendering
					disableRendering = false;
				}, 100);
			}
		});
	}
});

// Add smooth scroll
Horizon._registerPlugin(function(horizon) {
	horizon.smoothScroll = function(coords) {
		// Get scene
		var scene = horizon.getScene();
		if(scene === document) {
			scene = window;
		}
		// Run animation
		TweenLite.to(scene, 0.5, {
			scrollTo: coords,
			onComplete: function() {
				horizon.setCoords(coords);
			}
		});
	};
});