require('../node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js');

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
		Horizon._requestAnimationFrame(render);
	});
}, function(args) {
	TweenLite.to(window, 0.5, {scrollTo: args});
});