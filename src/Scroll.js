require('../node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js');

var disable = false;

Horizon._registerPlugin('scroll', function() {
	// Define rendering function
	var render = function() {
			Horizon.render({
				plugin: 'scroll',
				x: window.pageXOffset ||
					('documentElement' in document ? document.documentElement.scrollLeft : 0) ||
					('body' in document ? document.body.scrollLeft : 0),
				y: window.pageYOffset ||
					('documentElement' in document ? document.documentElement.scrollTop : 0) ||
					('body' in document ? document.body.scrollTop : 0),
				duration: 0.5
			});
		};
	// Listen to scroll event
	Horizon._listen(['scroll'], function(e) {
		if(!disable) {
			Horizon._requestAnimationFrame(render);
		}
	});
}, function(args) {
	disable = true;
	TweenLite.to(window, 0.5, {
		scrollTo: args,
		onComplete: function() {
			disable = false;
		}
	});
});