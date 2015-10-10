require('../bower_components/impetus/impetus.js');
var Horizon = require('Horizon').getInstance();

var impetus;

Horizon._registerPlugin('swipe', function(options) {
	// Init Impetus
	var options = options  || {};
	options.source = document;
	options.update = function(x, y) {
		Horizon.render({
			plugin: 'swipe',
			x: x,
			y: y,
			duration: 0.25
		});
	};
	impetus = new Impetus(options);
	// Add some CSS rules
	Horizon._addCSSRule('body', 'cursor: all-scroll; cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;');
	Horizon._addCSSRule('body:active', 'cursor: -moz-grabbing; cursor: -webkit-grabbing; cursor: grabbing;');
}, function(args) {
	impetus.setValues(args.x, args.y);
});