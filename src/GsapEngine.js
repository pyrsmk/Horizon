require('../node_modules/gsap/src/uncompressed/TweenLite.js');
require('../node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js');
require('../node_modules/gsap/src/uncompressed/easing/EasePack.js');

Horizon.registerEngine('gsap', function(args) {
	// Define animation options
	var options = {};
	options.autoCSS = true;
	if('easing' in args.properties) {
		options.ease = args.properties.easing;
		delete args.properties.easing;
	}
	else {
		options.ease = args.easing;
	}
	// Add properties
	for(var name in args.properties) {
		options[name] = args.properties[name];
	}	
	// Animate
	TweenLite.to(args.node, args.duration, options);
});