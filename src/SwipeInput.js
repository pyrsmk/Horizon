var Impetus = require('../node_modules/impetus/dist/impetus.js'),
	impetus;

Horizon._registerInput('swipe', {
	constructor: function(horizon, options) {
		// Measure the generic scrollbar size for that browser
		var measure = document.createElement('div');
		measure.style = {
			width: '100px',
			height: '100px',
			overflow: 'scroll',
			position: 'absolute',
			top: '-9999px'
		};
		document.body.appendChild(measure);
		var scrollbar_size = measure.offsetWidth - measure.clientWidth;
		document.body.removeChild(measure);
		// Avoid swiping when the mouse is over the scrollbar
		var scrollbar_focused = false;
		Horizon._listen(['mousedown'], window, function(e) {
			// Prepare
			var scene = horizon.getScene(),
				width = horizon.getSceneWidth(),
				height = horizon.getSceneHeight();
			// Detect if a scrollbar is present
			if(scene === document) {
				// Compute dimensions of the scene
				if(document.documentElement.offsetWidth != window.innerWidth) {
					width -= scrollbar_size;
				}
				if(document.documentElement.offsetHeight != window.innerHeight) {
					height -= scrollbar_size;
				}
				// Verify if we're over the scrollbar
				if(e.screenX > width || e.screenY > height) {
					scrollbar_focused = true;
				}
			}
			else {
				// Compute dimensions of the scene
				if(scene.offsetWidth != scene.clientWidth) {
					width -= scrollbar_size;
				}
				if(scene.offsetHeight != scene.clientHeight) {
					height -= scrollbar_size;
				}
				// Compute position of the scene in the layout
				var left = 0,
					top = 0;
				do {
					top += scene.offsetTop || 0;
					left += scene.offsetLeft || 0;
					scene = scene.offsetParent;
				}
				while(scene);
				// Verify if we're over the scrollbar
				if(
					(e.pageX > width + left && e.pageX < width + left + scrollbar_size) ||
					(e.pageY > height + top && e.pageY < width + top + scrollbar_size)
				) {
					scrollbar_focused = true;
				}
			}
		});
		Horizon._listen(['mouseup'], window, function(e) {
			scrollbar_focused = false;
		});
		// Init Impetus
		options = options  || {};
		options.source = horizon.getScene();
		options.update = function(x, y) {
			if(!scrollbar_focused) {
				horizon.render({
					trigger: 'swipe',
					caller: 'swipe',
					x: x,
					y: y,
					duration: 250
				});
			}
		};
		var boundaries = horizon.getBoundaries();
		if('x' in boundaries) {
			options.boundX = boundaries.x;
		}
		if('y' in boundaries) {
			options.boundY = boundaries.y;
		}
		impetus = new Impetus(options);
		// Add some CSS rules
		Horizon._addCSSRule('body', 'cursor: all-scroll; cursor: -moz-grab; cursor: -webkit-grab; cursor: grab;');
		Horizon._addCSSRule('body:active', 'cursor: -moz-grabbing; cursor: -webkit-grabbing; cursor: grabbing;');
	},
	setter: function(horizon, coords) {
		impetus.setValues(coords.x, coords.y);
	}
});