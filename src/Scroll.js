require('../node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js');

var disable_rendering = false;

Horizon._registerPlugin('scroll', function(node) {
	// Format
	if(!node) {
		node = window;
	}
	// Define rendering function
	var render = function() {
			if(!disable_rendering) {
				var x,
					y;
				if(node === window) {
					x = window.pageXOffset ||
						('documentElement' in document ? document.documentElement.scrollLeft : 0) ||
						('body' in document ? document.body.scrollLeft : 0);
					y = window.pageYOffset ||
						('documentElement' in document ? document.documentElement.scrollTop : 0) ||
						('body' in document ? document.body.scrollTop : 0);
				}
				else {
					x = node.scrollLeft;
					y = node.scrollTop;
				}
				Horizon.render({
					plugin: 'scroll',
					x: x,
					y: y,
					duration: 0.5
				});
			}
		};
	// Listen to scroll event
	Horizon._listen(['scroll'], function(e) {
		Horizon._requestAnimationFrame(render);
	}, node);
}, function(args) {
	args.render = 'render' in args ? args.render : false;
	if(!args.render) {
		disable_rendering = true;
	}
	TweenLite.to(window, 0.5, {
		scrollTo: args,
		onComplete: function() {
			disable_rendering = false;
		}
	});
});