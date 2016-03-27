(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Horizon = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(n,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():n.W=e()}(this,function(){function n(){var n;if("orientation"in window){var e=window.orientation;n=90==e||-90==e}else n=window.innerWidth>window.innerHeight;return n?"landscape":"portrait"}function e(e){var t=screen.width,i=screen.height;if("landscape"==n()&&i>t&&(t=screen.height,i=screen.width),e)return{width:t,height:i};var r=window.innerWidth,o=window.innerHeight;return(!r||!o||r>t||o>i||980==r)&&(r=window.outerWidth,o=window.outerHeight),(!r||!o||r>t||o>i)&&(r=screen.availWidth,o=screen.availHeight),{width:r,height:o}}var t=[],i=!1;window.addEventListener?"onorientationchange"in window?window.addEventListener("orientationchange",function(){i=!0},!1):window.addEventListener("resize",function(){i=!0},!1):window.attachEvent("onresize",function(){i=!0}),setInterval(function(){if(i&&document.documentElement.clientWidth){i=!1;for(var n=0,e=t.length;e>n;++n)t[n].func()}},10);var r={getViewportDimensions:function(n){return e(n)},getViewportWidth:function(n){return e(n).width},getViewportHeight:function(n){return e(n).height},getOrientation:function(){return n()},addListener:function(n,e){return t.push({func:n,key:e}),n},removeListener:function(n){for(var e=0,i=t.length;i>e;++e)if(t[e].key==n){t.splice(e,1);break}},clearListeners:function(){t=[]},trigger:function(n){for(var e=0,i=t.length;i>e;++e)("undefined"==typeof n||t[e].key==n)&&t[e].func()}};return r});
},{}],2:[function(require,module,exports){
/*! Horizon 3.0.3 (https://github.com/pyrsmk/Horizon) */

var W = require('../node_modules/pyrsmk-w/W.min.js'),
	Horizon = {};

// Init properties
Horizon.scene = window;
Horizon.x = 0;
Horizon.y = 0;
Horizon.z = 0;
Horizon.callbacks = {};
Horizon.engines = {};
Horizon.engine = '';
Horizon.inputs = {};
Horizon.disabled_inputs = [];
Horizon.viewport = {width: 0, height: 0};
Horizon.layout = {width: 0, height: 0};
Horizon.orientation = 'landscape';
Horizon.boundaries = false;
Horizon.regex = {
	unit: /(\d+(?:\.\d+)?)([a-z]+|%)/i,
	list: /^(?:\s*([\w.]+)\s*)(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?$/,
	hexa: /#(\w{2})(\w{2})(\w{2})/i,
	rgba: /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
	hsla: /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/
};

/*
	Set scene node
	
	Parameters
		Object scene
*/
Horizon.setScene = function(scene) {
	Horizon.scene = scene;
	Horizon.detectViewport();
	Horizon.detectLayout();
};

/*
	Detect the viewport dimensions
*/
Horizon.detectViewport = function() {
	var width,
		height;
	if(Horizon.scene === window) {
		width = W.getViewportWidth();
		height = W.getViewportHeight();
	}
	else {
		width = Horizon.scene.offsetWidth;
		height = Horizon.scene.offsetHeight;
	}
	Horizon.viewport.width = width;
	Horizon.viewport.height = height;
};

/*
	Detect the layout dimensions
*/
Horizon.detectLayout = function() {
	var width,
		height;
	if(Horizon.scene === window) {
		width = Math.max(
			document.body ? document.body.scrollWidth : 0,
			document.body ? document.body.offsetWidth : 0,
			document.documentElement.clientWidth,
			document.documentElement.scrollWidth,
			document.documentElement.offsetWidth
		);
		height = Math.max(
			document.body ? document.body.scrollHeight : 0,
			document.body ? document.body.offsetHeight : 0,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);
	}
	else {
		width = Horizon.scene.scrollWidth;
		height = Horizon.scene.scrollHeight;
	}
	Horizon.layout.width = width;
	Horizon.layout.height = height;
};

/*
	Detect device orientation
*/
Horizon.detectOrientation = function() {
	Horizon.orientation = W.getOrientation();
};

/*
	Register an engine
	
	Parameters
		String name
		Function func
*/
Horizon.registerEngine = function(name, func) {
	Horizon.engines[name] = func;
	Horizon.setEngine(name);
};

/*
	Switch current engine to another one
	
	Parameters
		String name
*/
Horizon.setEngine = function(name) {
	Horizon.engine = name;
};

/*
	Register an input plugin

	Parameters
		String name
		Function constructor
		Function setter
*/
Horizon.registerInput = function(name, constructor, setter) {
	constructor.loaded = false;
	Horizon.inputs[name] = {
		constructor: constructor,
		setter: setter
	};
	Horizon[name] = function(node, callback) {
		Horizon.initInput(name);
		if(!(name in Horizon.callbacks)) {
			Horizon.callbacks[name] = [];
		}
		if(typeof node == 'function') {
			Horizon.callbacks[name].push({
				node: {},
				callback: node
			});
		}
		else {
			Horizon.callbacks[name].push({
				node: node,
				callback: callback
			});
		}
	};
};

/*
	Initialize an input plugin

	Parameters
		String name
		Object options
*/
Horizon.initInput = function(name, options) {
	if(!Horizon.inputs[name].loaded) {
		Horizon.inputs[name].constructor(options);
		Horizon.inputs[name].loaded = true;
	}
};

/*
	Disable an input plugin from rendering

	Parameters
		String name
*/
Horizon.disableInput = function(name) {
	if(Horizon.disabled_inputs.indexOf(name) == -1) {
		Horizon.disabled_inputs.push(name);
	}
};

/*
	Enable an input plugin that has been previously disabled

	Parameters
		String name
*/
Horizon.enableInput = function(name) {
	Horizon.disabled_inputs.splice(Horizon.disabled_inputs.indexOf(name), 1);
};

/*
	Set coords for the specified plugin

	Parameters
		String name
		Object options
*/
Horizon.setXY = function(name, options) {
	if(typeof Horizon.inputs[name].setter == 'function') {
		Horizon.inputs[name].setter(options);
	}
};

/*
	Add a parallax animation for several inputs

	Parameters
		Array inputs
		Object node
		Function callback
*/
Horizon.parallax = function(inputs, node, callback) {
	for(var i=0, j=inputs.length; i<j; ++i) {
		if(!(inputs[i] in Horizon)) {
			throw new Error("'"+inputs[i]+"' input plugin is not registered");
		}
		Horizon[inputs[i]](node, callback);
	}
};

/*
	Interpolate a value

	Parameters
		Number position
		Object interpolations

	Return
		Object
*/
Horizon.interpolate = function(position, interpolations) {
	// Get indexes
	var indexes = Object.keys(interpolations).sort(function(a, b) {
		return a - b;
	});
	// Compute values
	var properties = {},
		values1,
		values2,
		values3;
	for(var i=0, j=indexes.length; i<j; ++i) {
		// We found 2 available points
		if(i + 1 < j) {
			// First element
			if(i == 0 && position <= indexes[i]) {
				for(var name in interpolations[indexes[i]]) {
					properties[name] = interpolations[indexes[i]][name];
				}
				break;
			}
			// Next elements
			if(position >= indexes[i] && position <= indexes[i+1]) {
				for(var name in interpolations[indexes[i]]) {
					// Apply interpolations
					for(var type in Horizon.regex) {
						if(type == 'unit') {
							continue;
						}
						if(
							Horizon.regex[type].test(interpolations[indexes[i]][name]) &&
							Horizon.regex[type].test(interpolations[indexes[i+1]][name])
						) {
							// Extract values
							values1 = Horizon.regex[type].exec(interpolations[indexes[i]][name]);
							values2 = Horizon.regex[type].exec(interpolations[indexes[i+1]][name]);
							values1.shift();
							values2.shift();
							// Interpolate values
							values3 = [];
							for(var k=0, l=values1.length; k<l; ++k) {
								if(typeof values1[k] != 'undefined' && typeof values2[k] != 'undefined') {
									if(type == 'hexa') {
										values3.push(Horizon.interpolateValue(
											parseInt(values1[k], 16),
											parseInt(values2[k], 16),
											indexes[i],
											indexes[i+1],
											position
										));
									}
									else {
										values3.push(Horizon.interpolateValue(
											values1[k],
											values2[k],
											indexes[i],
											indexes[i+1],
											position
										));
									}
								}
							}
							// Set final property
							switch(type) {
								case 'list':
									switch(values3.length) {
										case 1:
											properties[name] = values3[0];
											break;
										case 2:
											properties[name] = values3[0]+' '+values3[1];
											break;
										case 3:
											properties[name] = values3[0]+' '+values3[1]+' '+values3[2];
											break;
										case 4:
											properties[name] = values3[0]+' '+values3[1]+' '+values3[2]+' '+values3[3];
											break;
									}
									break;
								case 'hexa':
									var a = Math.round(values3[0]).toString(16),
										b = Math.round(values3[1]).toString(16),
										c = Math.round(values3[2]).toString(16);
									if(a.length == 1) a += '0';
									if(b.length == 1) b += '0';
									if(c.length == 1) c += '0';
									properties[name] = '#' + a + b + c;
									break;
								case 'rgba':
									if(values3.length == 3) {
										properties[name] = 'rgb(' +
											Math.round(values3[0]) + ',' + 
											Math.round(values3[1]) + ',' +
											Math.round(values3[2]) + ')';
									}
									else {
										properties[name] = 'rgba(' +
											Math.round(values3[0]) + ',' +
											Math.round(values3[1]) + ',' +
											Math.round(values3[2]) + ',' +
											Math.round(values3[3]) + ')';
									}
									break;
								case 'hsla':
									if(values3.length == 3) {
										properties[name] = 'hsl(' + 
											Math.round(values3[0]) + ',' +
											Math.round(values3[1]) + '%,' +
											Math.round(values3[2]) + '%)';
									}
									else {
										properties[name] = 'hsla(' + 
											Math.round(values3[0]) + ',' +
											Math.round(values3[1]) + '%,' +
											Math.round(values3[2]) + '%,' +
											Math.round(values3[3]) + ')';
									}
									break;
							}
							break;
						}
					}
					// Restore non-numeric properties
					if(!properties[name]) {
						properties[name] = interpolations[indexes[i]][name];
					}
				}
				break;
			}
		}
		// We're at the end
		else {
			for(var name in interpolations[indexes[i]]) {
				properties[name] = interpolations[indexes[i]][name];
			}
		}
	}
	return properties;
};

/*
	Interpolate one value

	Parameters
		Number value1
		Number value2
		Number index1
		Number index2
		Number position

	Return
		Number
*/
Horizon.interpolateValue = function(value1, value2, index1, index2, position) {
	// Normalize values
	var unit1 = '', unit2 = '', value3;
	if(Horizon.regex.unit.test(value1)) {
		value1 = Horizon.regex.unit.exec(value1);
		unit1 = value1[2];
		value1 = value1[1];
	}
	value1 = parseFloat(value1);
	if(Horizon.regex.unit.test(value2)) {
		value2 = Horizon.regex.unit.exec(value2);
		unit2 = value2[2];
		value2 = value2[1];
	}
	value2 = parseFloat(value2);
	index1 = parseFloat(index1);
	index2 = parseFloat(index2);
	// Units mismatch
	if(unit1 != unit2) {
		value3 = value1 + unit1;
	}
	// Same value between both points
	else if(value1 == value2) {
		value3 = value1 + unit1;
	}
	// Different values, let's scale
	else {
		value3 = ((position - index1) *
				(value2 - value1) /
				(index2 - index1) +
				value1) + unit1;
	}
	return value3;
};

/*
	Render elements

	Parameters
		Object args {
			input,
			x,
			y,
			duration,
			easing
		}
*/
Horizon.render = function(args) {
	// Format arguments
	args = args || {};
	args.x = 'x' in args ? parseInt(args.x,10) : 0;
	args.y = 'y' in args ? parseInt(args.y,10) : 0;
	args.z = 'z' in args ? parseInt(args.z,10) : 0;
	args.duration = 'duration' in args ? parseFloat(args.duration) : 0.001;
	args.easing = 'easing' in args ? args.easing : Power4.easeOut;
	args.context = 'context' in args ? args.context : 'absolute';
	// Normalize coords
	if(args.context == 'relative') {
		args.x = Horizon.x + args.x;
		args.y = Horizon.y + args.y;
		args.z = Horizon.z + args.z;
	}
	// Limit x/y to the layout boundaries
	if(Horizon.boundaries) {
		if(args.x < 0) {
			args.x = 0;
		}
		else if(args.x > Horizon.layout.width) {
			args.x = Horizon.layout.width;
		}
		if(args.y < 0) {
			args.y = 0;
		}
		else if(args.y > Horizon.layout.height) {
			args.y = Horizon.layout.height;
		}
	}
	// Generate animations
	if(!('input' in args) || Horizon.disabled_inputs.indexOf(args.input) == -1) {
		var left,
			top,
			width,
			height,
			element,
			properties;
		for(var input in Horizon.callbacks) {
			if(!('input' in args) || args.input == input) {
				for(var i=0, j=Horizon.callbacks[input].length; i<j; ++i) {
					element = Horizon.callbacks[input][i];
					// Define callback parameters
					var params = {
						x: args.x,
						y: args.y,
						z: args.z
					};
					// Define relative positions
					left = element.node.offsetLeft;
					top = element.node.offsetTop;
					width = element.node.offsetWidth;
					height = element.node.offsetHeight;
					params.left = left;
					params.right = left - Horizon.viewport.width + width;
					params.centerX = left - ((Horizon.viewport.width - width) / 2);
					params.top = top;
					params.bottom = top - Horizon.viewport.height + height;
					params.centerY = top - ((Horizon.viewport.height - height) / 2);
					// Limit x/y to the layout boundaries
					if(Horizon.boundaries) {
						if((params.x + width) > Horizon.layout.width) {
							params.x = Horizon.layout.width - width;
						}
						if((params.y + height) > Horizon.layout.height) {
							params.y = Horizon.layout.height - height;
						}
					}
					// Populate options
					properties = element.callback(params);
					if(!properties) {
						continue;
					}
					if(properties.duration) {
						args.duration = properties.duration;
						delete properties.duration;
					}
					// Render
					Horizon.engines[Horizon.engine]({
						node: element.node,
						duration: args.duration,
						easing: args.easing,
						properties: properties
					});
				}
			}
		}
		// Update scene position
		Horizon.x = args.x;
		Horizon.y = args.y;
		Horizon.z = args.z;
	}
};

/*
	Listen for events

	Parameters
		Array events
		Object node
		Function callback
*/
Horizon.listen = function(events, node, callback) {
	for(var i=0, j=events.length; i<j; ++i) {
		if(node.addEventListener) {
			node.addEventListener(events[i], callback, false);
		}
		else{
			node.attachEvent('on' + events[i], callback);
		}
	}
};

/*
	Add CSS rules in our own stylesheet
*/
Horizon.addCSSRule = function(selector, rules) {
	if(!('sheet' in Horizon)) {
		var style = document.createElement('style');
		style.appendChild(document.createTextNode('')); // Webkit
		document.head.appendChild(style);
		Horizon.sheet = style.sheet;
	}
	if('insertRule' in Horizon.sheet) {
		Horizon.sheet.insertRule(selector + '{' + rules + '}', 0);
	}
	else if('addRule' in Horizon.sheet) {
		Horizon.sheet.addRule(selector, rules, 0);
	}
};

/*
	Simple RequestAnimationFrame polyfill

	Parameters
		Function func
*/
Horizon.requestAnimationFrame = function(func) {
	if(!('requestAnimationFrame' in window)) {
		window.requestAnimationFrame = window.mozRequestAnimationFrame ||
										window.webkitRequestAnimationFrame ||
										window.msRequestAnimationFrame ||
										function(func) { func(); };
	}
	window.requestAnimationFrame(func);
};

// Init
W.addListener(function() {
	Horizon.detectViewport();
	Horizon.detectLayout();
	Horizon.detectOrientation();
})();

// Export module
module.exports = Horizon;
},{"../node_modules/pyrsmk-w/W.min.js":1}]},{},[2])(2)
});