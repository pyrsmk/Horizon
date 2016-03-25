require('../node_modules/gsap/src/uncompressed/plugins/ScrollToPlugin.js');

var disable_rendering = false;

Horizon.registerInput('scroll', function() {
	
	// Define rendering function
	var render = function() {
		if(!disable_rendering) {
			var x,
				y;
			if(Horizon.scene === window) {
				x = window.pageXOffset ||
					('documentElement' in document ? document.documentElement.scrollLeft : 0) ||
					('body' in document ? document.body.scrollLeft : 0);
				y = window.pageYOffset ||
					('documentElement' in document ? document.documentElement.scrollTop : 0) ||
					('body' in document ? document.body.scrollTop : 0);
			}
			else {
				x = Horizon.scene.scrollLeft;
				y = Horizon.scene.scrollTop;
			}
			Horizon.render({
				input: 'scroll',
				x: x,
				y: y,
				duration: 0.5
			});
		}
	};
	
	// Listen to scroll event
	Horizon.listen(['scroll'], Horizon.scene, function(e) {
		Horizon.requestAnimationFrame(render);
	});

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