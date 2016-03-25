Horizon.registerInput('mouse', function() {
	Horizon.listen(['mousemove'], window, function(e) {
		e = e || window.event;
		
		Horizon.render({
			input: 'mouse',
			x: e.pageX,
			y: e.pageY,
			duration: 0.25
		});
	});
});