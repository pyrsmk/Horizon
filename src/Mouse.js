var Horizon = require('Horizon').getInstance();

Horizon._registerPlugin('mouse', function() {
	Horizon._listen(['mousemove'], function(e) {
		e = e || window.event;
		Horizon.render({
			plugin: 'mouse',
			x: e.pageX,
			y: e.pageY,
			duration: 0.1
		});
	});
});