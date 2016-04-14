(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Add isGyroscopeSupported() method
Horizon._registerPlugin(function(horizon) {
	horizon.isGyroscopeSupported = function() {
		return 'DeviceOrientationEvent' in window;
	};
});

// Register gyroscope input
Horizon._registerInput('gyroscope', {
	constructor: function(horizon, options) {
		// Handle gyroscope things
		var interval, direction;
		function gyroscope(x, y, z) {
			var real_x = x,
				real_y = y;
			if('orientation' in window) {
				switch(window.orientation) {
					case 90:
						real_x = y;
						real_y = -x;
						break;
					case 180:
						real_x = -x;
						real_y = -y;
						break;
					case -90:
						real_x = -y;
						real_y = x;
						break;
				}
			}
			if(x != null && y != null && z != null) {
				horizon.render({
					trigger: 'gyroscope',
					caller: 'gyroscope',
					context: 'relative',
					x: real_x,
					y: real_y,
					duration: 500
				});
				horizon.render({
					trigger: 'gyroscope',
					caller: 'gyroscope',
					context: 'absolute',
					z: z,
					duration: 500
				});
			}
		}
		// Listen to gyroscope
		if(horizon.isGyroscopeSupported()) {
			window.addEventListener('deviceorientation', function (event) {
				gyroscope(event.gamma, event.beta, event.alpha);
			}, false);
		}
	},
	setter: function(horizon, coords) {}
});
},{}]},{},[1]);
