Horizon._registerRenderer('gsap', function(horizon, args) {
	// Define animation options
	var options = {};
	options.autoCSS = true;
	options.ease = args.easing;
	if(typeof args.complete == 'function') {
		options.onComplete = args.complete;
	}
	// Add properties
	for(var name in args.properties) {
		options[name] = args.properties[name];
	}	
	// Animate
	TweenLite.to(args.node, args.duration / 1000, options);
});