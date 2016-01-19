(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
Horizon._registerPlugin('background', function() {
	// Override background()
	Horizon.background = function(node, url, size) {
		size = size || 105;
		node.style.backgroundImage = 'url(' + url + ')';
		node.style.backgroundSize = size + '%';
		node.style.backgroundPosition = '50% 50%';
		Horizon.mouse(node, function(args) {
			var percentX = args.x * 100 / Horizon.viewport.width,
				percentY = args.y * 100 / Horizon.viewport.height;
			if(percentX > 100) {
				percentX = 100;
			}
			if(percentY > 100) {
				percentY = 100;
			}
			return {backgroundPosition: percentX + '% ' + percentY + '%'};
		});
	};
});

Horizon.initPlugin('background');
},{}]},{},[1]);
