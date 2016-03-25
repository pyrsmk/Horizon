Horizon.registerInput('wheel', function() {
	Horizon.listen(['mousewheel', 'wheel', 'MozMousePixelScroll'], window, function(e) {
		// Compute position
		var y;
		e = e || window.event;
		if('deltaY' in e) {
			y = e.deltaY;
		}
		else if('detail' in e) {
			y = e.detail * -1;
		}
		else if('wheelDelta' in e) {
			y = e.wheelDelta * -1;
		}
		else if('wheelDeltaY' in e) {
			y = e.wheelDeltaY * -1;
		}
		if(y) { // Because IE triggers 2 wheel events : one normal and another one which returns 0
			Horizon.render({
				input: 'wheel',
				context: 'relative',
				x: y,
				y: y,
				duration: 0.5
			});
		}
	});
});