var Horizon = require('Horizon').getInstance();

Horizon._registerPlugin('gyro', function() {
	// Handle gyroscope things
	var interval, direction;
	function gyro(x, y, z) {
		if(x != null && y != null && z != null) {
			Horizon.render({
				plugin: 'gyro',
				context: 'relative',
				x: x,
				y: y,
				z: z,
				duration: 0.5
			});
		}
	}
	// Listen to gyroscope events
	if(window.DeviceOrientationEvent) {
		window.addEventListener('deviceorientation', function (event){
			gyro(event.gamma, event.beta, event.alpha);
		}, false);
	}
	else if(window.DeviceMotionEvent) {
		window.addEventListener('devicemotion', function (event){
			gyro(event.acceleration.x * 2, event.acceleration.y * 2, 0);
		}, false);
	}
	else {
		window.addEventListener('MozOrientation', function (orientation){
			gyro(orientation.x * 50, orientation.y * 50, 0);
		}, false);
	}
});