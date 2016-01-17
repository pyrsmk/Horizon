var Impetus = require('../node_modules/impetus/dist/impetus.js'),
	impetus;

Horizon._registerPlugin('swipe', function(options) {
	// Init Impetus
	var options = options  || {},
		render = function(x, y) {
			return function() {
				Horizon.render({
					plugin: 'swipe',
					x: x,
					y: y,
					duration: 0.25
				});
			};
		};
	options.source = document;
	options.update = function(x, y) {
		Horizon._requestAnimationFrame(render(x, y));
	};
	impetus = new Impetus(options);
	// Add some CSS rules
	Horizon._addCSSRule('body', 'cursor: all-scroll; cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;');
	Horizon._addCSSRule('body:active', 'cursor: -moz-grabbing; cursor: -webkit-grabbing; cursor: grabbing;');
}, function(args) {
	impetus.setValues(args.x, args.y);
	Horizon.render({
		plugin: 'swipe',
		x: args.x,
		y: args.y,
		duration: 0.25
	});
});