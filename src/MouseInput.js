Horizon._registerInput('mouse', {
	constructor: function(horizon, options) {
		Horizon._listen(['mousemove'], window, function(e) {
			e = e || window.event;
			horizon.render({
				trigger: 'mouse',
				caller: 'mouse',
				x: e.pageX,
				y: e.pageY,
				duration: 250
			});
		});
	},
	setter: function(horizon, coords) {}
});