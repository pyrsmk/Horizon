(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Horizon._registerPlugin('wheel', function() {
	Horizon._listen(['mousewheel', 'wheel', 'MozMousePixelScroll'], function(e) {
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
				plugin: 'wheel',
				context: 'relative',
				x: y,
				y: y,
				duration: 0.5
			});
		}
	});
});
},{}]},{},[1]);
