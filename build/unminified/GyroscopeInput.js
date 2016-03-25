(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Horizon.registerInput('gyro', function() {
	// Handle gyroscope things
	var interval, direction;
	function gyro(x, y, z) {
		if(x != null && y != null && z != null) {
			Horizon.render({
				input: 'gyro',
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
},{}]},{},[1]);
