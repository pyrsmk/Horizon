var Impetus = require('../node_modules/impetus/dist/impetus.js'),
	impetus;

Horizon.registerInput('swipe', function(options) {
	// Init Impetus
	var options = options  || {},
		render = function(x, y) {
			return function() {
				Horizon.render({
					input: 'swipe',
					x: -x,
					y: -y,
					duration: 0.25
				});
			};
		};
	options.source = document;
	options.update = function(x, y) {
		Horizon.requestAnimationFrame(render(x, y));
	};
	impetus = new Impetus(options);
	// Add some CSS rules
	Horizon.addCSSRule('body', 'cursor: all-scroll; cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;');
	Horizon.addCSSRule('body:active', 'cursor: -moz-grabbing; cursor: -webkit-grabbing; cursor: grabbing;');
}, function(args) {
	args.render = 'render' in args ? args.render : false;
	impetus.setValues(-args.x, -args.y);
	if(args.render) {
		Horizon.render({
			input: 'swipe',
			x: args.x,
			y: args.y,
			duration: 0.25
		});
	}
});