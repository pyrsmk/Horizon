(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Horizon = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
!function(n,e){"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():n.W=e()}(this,function(){function n(){var n;if("orientation"in window){var e=window.orientation;n=90==e||-90==e}else n=window.innerWidth>window.innerHeight;return n?"landscape":"portrait"}function e(e){var t=screen.width,i=screen.height;if("landscape"==n()&&i>t&&(t=screen.height,i=screen.width),e)return{width:t,height:i};var r=window.innerWidth,o=window.innerHeight;return(!r||!o||r>t||o>i||980==r)&&(r=window.outerWidth,o=window.outerHeight),(!r||!o||r>t||o>i)&&(r=screen.availWidth,o=screen.availHeight),{width:r,height:o}}var t=[],i=!1,r=!1,o=!1;window.addEventListener?("onorientationchange"in window&&(r=!0,window.addEventListener("orientationchange",function(){o=!0},!1)),window.addEventListener("resize",function(){i=!0},!1)):window.attachEvent("onresize",function(){i=!0}),setInterval(function(){var n=!1;if(r?o&&i&&(n=!0):i&&(n=!0),n&&document.documentElement.clientWidth){o=!1,i=!1;for(var e=0,d=t.length;d>e;++e)t[e].func()}},10);var d={getViewportDimensions:function(n){return e(n)},getViewportWidth:function(n){return e(n).width},getViewportHeight:function(n){return e(n).height},getOrientation:function(){return n()},addListener:function(n,e){return t.push({func:n,key:e}),n},removeListener:function(n){for(var e=0,i=t.length;i>e;++e)if(t[e].key==n){t.splice(e,1);break}},clearListeners:function(){t=[]},trigger:function(n){for(var e=0,i=t.length;i>e;++e)"undefined"!=typeof n&&t[e].key!=n||t[e].func()}};return d});
},{}],2:[function(require,module,exports){
/*! Horizon 4.1.0 (https://github.com/pyrsmk/Horizon) */

var W = require('../node_modules/pyrsmk-w/W.min.js');

// Constructor
var Horizon = function(scene) {
	// Init object
	var horizon = {
		_x: 0,
		_y: 0,
		_z: 0,
		_boundaries: {},
		_scene: null,
		_scene_width: 0,
		_scene_height: 0,
		_callbacks: {},
		_renderer: 'gsap',
		_loaded_inputs: [],
		_disabled_inputs: []
	};

	/*
		Get scene

		Return
			Object
	*/
	horizon.getScene = function() {
		return horizon._scene;
	};

	/*
		Detect the scene dimensions
	*/
	horizon.detectSceneDimensions = function() {
		if(horizon._scene === document) {
			horizon._scene_width = W.getViewportWidth();
			horizon._scene_height = W.getViewportHeight();
		}
		else {
			horizon._scene_width = horizon._scene.offsetWidth;
			horizon._scene_height = horizon._scene.offsetHeight;
		}
	};

	/*
		Get the scene's width

		Return
			Number
	*/
	horizon.getSceneWidth = function() {
		return horizon._scene_width;
	};

	/*
		Get the scene's height

		Return
			Number
	*/
	horizon.getSceneHeight = function() {
		return horizon._scene_height;
	};

	/*
		Set default renderer

		Parameters
			String name
	*/
	horizon.setDefaultRenderer = function(name) {
		horizon._renderer = name.toLowerCase();
	};
	
	/*
		Set boundaries
		
		Parameters
			Object boundaries
	*/
	horizon.setBoundaries = function(boundaries) {
		horizon._boundaries = boundaries;
	};
	
	/*
		Get boundaries
		
		Return
			Object
	*/
	horizon.getBoundaries = function() {
		return horizon._boundaries;
	};

	/*
		Initialize an input plugin

		Parameters
			String name
			Object options
	*/
	horizon.initInput = function(name, options) {
		if(horizon._loaded_inputs.indexOf(name) == -1) {
			Horizon._inputs[name].constructor(horizon, options);
			horizon._loaded_inputs.push(name);
		}
	};

	/*
		Disable an input plugin from rendering

		Parameters
			String name
	*/
	horizon.disableInput = function(name) {
		if(horizon._disabled_inputs.indexOf(name) == -1) {
			horizon._disabled_inputs.push(name);
		}
	};

	/*
		Enable an input plugin that has been previously disabled

		Parameters
			String name
	*/
	horizon.enableInput = function(name) {
		horizon._disabled_inputs.splice(horizon._disabled_inputs.indexOf(name), 1);
	};

	/*
		Set coords

		Parameters
			Object coords
	*/
	horizon.setCoords = function(coords) {
		if('x' in coords) {
			horizon._x = coords.x;
		}
		if('y' in coords) {
			horizon._y = coords.y;
		}
		if('z' in coords) {
			horizon._z = coords.z;
		}
		for(var i=0, j=horizon._loaded_inputs.length; i<j; ++i) {
			Horizon._inputs[horizon._loaded_inputs[i]].setter(horizon, coords);
		}
	};
	
	/*
		Get coords
		
		Return
			Object
	*/
	horizon.getCoords = function() {
		return {
			x: horizon._x,
			y: horizon._y,
			z: horizon._z
		};
	};

	/*
		Add a parallax animation for several inputs

		Parameters
			Array inputs
			Object node
			Function callback
	*/
	horizon.parallax = function(inputs, node, callback) {
		for(var i=0, j=inputs.length; i<j; ++i) {
			if(!(inputs[i] in horizon)) {
				throw new Error("'"+inputs[i]+"' input plugin is not registered");
			}
			if(typeof node == 'function') {
				horizon[inputs[i]](node);
			}
			else {
				horizon[inputs[i]](node, callback);
			}
		}
	};

	/*
		Render elements

		Parameters
			Object args {
				x,
				y,
				z,
				duration,
				easing,
				trigger,
				caller,
				context,
				complete
			}
	*/
	horizon.render = function(args) {
		// Normalize arguments
		args = args || {};
		var duration = 'duration' in args ? parseInt(args.duration, 10) : 1,
			easing = 'easing' in args ? args.easing : Power4.easeOut,
			context = 'context' in args ? args.context : 'absolute',
			x, y, z, relativeX, relativeY, relativeZ, i, j, input;
		// Normalize coords
		if(context == 'relative') {
			relativeX = 'x' in args ? parseInt(args.x, 10) : 0;
			relativeY = 'y' in args ? parseInt(args.y, 10) : 0;
			relativeZ = 'z' in args ? parseInt(args.z, 10) : 0;
			x = horizon._x + relativeX;
			y = horizon._y + relativeY;
			z = horizon._z + relativeZ;
		}
		else {
			x = 'x' in args ? parseInt(args.x, 10) : horizon._x;
			y = 'y' in args ? parseInt(args.y, 10) : horizon._y;
			z = 'z' in args ? parseInt(args.z, 10) : horizon._z;
			relativeX = x - horizon._x;
			relativeY = y - horizon._y;
			relativeZ = z - horizon._z;
		}
		// Limit x/y/z to the boundaries
		if('x' in horizon._boundaries) {
			if(x < horizon._boundaries.x[0]) {
				x = horizon._boundaries.x[0];
			}
			else if(x > horizon._boundaries.x[1]) {
				x = horizon._boundaries.x[1];
			}
		}
		if('y' in horizon._boundaries) {
			if(y < horizon._boundaries.y[0]) {
				y = horizon._boundaries.y[0];
			}
			else if(y > horizon._boundaries.y[1]) {
				y = horizon._boundaries.y[1];
			}
		}
		if('z' in horizon._boundaries) {
			if(z < horizon._boundaries.z[0]) {
				z = horizon._boundaries.z[0];
			}
			else if(z > horizon._boundaries.z[1]) {
				z = horizon._boundaries.z[1];
			}
		}
		// Generate animations
		if(!('caller' in args) || horizon._disabled_inputs.indexOf(args.caller) == -1) {
			var left,
				top,
				width,
				height,
				element,
				properties,
				renderer;
			for(input in horizon._callbacks) {
				if(!('trigger' in args) || args.trigger == input) {
					for(i=0, j=horizon._callbacks[input].length; i<j; ++i) {
						element = horizon._callbacks[input][i];
						// Define callback parameters
						var params = {
							x: x,
							y: y,
							z: z,
							relativeX: relativeX,
							relativeY: relativeY,
							relativeZ: relativeZ,
						};
						// Define relative positions
						if('offsetLeft' in element.node) {
							width = element.node.offsetWidth;
							height = element.node.offsetHeight;
							left = element.node.offsetLeft;
							top = element.node.offsetTop;
							params.left = left;
							params.right = left - horizon.getSceneWidth() + width;
							params.centerX = left - ((horizon.getSceneWidth() - width) / 2);
							params.top = top;
							params.bottom = top - horizon.getSceneHeight() + height;
							params.centerY = top - ((horizon.getSceneHeight() - height) / 2);
						}
						// Populate options
						properties = element.callback(params);
						if(!properties) {
							continue;
						}
						// Set duration
						if(properties.duration) {
							duration = properties.duration;
							delete properties.duration;
						}
						// Set easing
						if('easing' in properties) {
							easing = properties.easing;
							delete properties.easing;
						}
						// Set renderer to use
						if('renderer' in properties) {
							renderer = properties.renderer.toLowerCase();
							delete properties.renderer;
						}
						else {
							renderer = horizon._renderer;
						}
						// Render
						Horizon._renderers[renderer](horizon, {
							node: element.node,
							duration: duration,
							easing: easing,
							properties: properties,
							complete: args.complete
						});
					}
				}
			}
			// Update scene position
			horizon._x = x;
			horizon._y = y;
			horizon._z = z;
			// Update input states
			for(i=0, j=horizon._loaded_inputs.length; i<j; ++i) {
				input = horizon._loaded_inputs[i];
				if(!('caller' in args) || input != args.caller) {
					Horizon._inputs[input].setter(horizon, {x: x, y: y, z: z});
				}
			}
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
	horizon.interpolate = function(position, interpolations) {
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
						for(var type in Horizon._regex) {
							if(type == 'unit') {
								continue;
							}
							if(
								Horizon._regex[type].test(interpolations[indexes[i]][name]) &&
								Horizon._regex[type].test(interpolations[indexes[i+1]][name])
							) {
								// Extract values
								values1 = Horizon._regex[type].exec(interpolations[indexes[i]][name]);
								values2 = Horizon._regex[type].exec(interpolations[indexes[i+1]][name]);
								values1.shift();
								values2.shift();
								// Interpolate values
								values3 = [];
								for(var k=0, l=values1.length; k<l; ++k) {
									if(typeof values1[k] != 'undefined' && typeof values2[k] != 'undefined') {
										if(type == 'hexa') {
											values3.push(horizon._interpolateValue(
												parseInt(values1[k], 16),
												parseInt(values2[k], 16),
												indexes[i],
												indexes[i+1],
												position
											));
										}
										else {
											values3.push(horizon._interpolateValue(
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
	horizon._interpolateValue = function(value1, value2, index1, index2, position) {
		// Normalize values
		var unit1 = '', unit2 = '', value3;
		if(Horizon._regex.unit.test(value1)) {
			value1 = Horizon._regex.unit.exec(value1);
			unit1 = value1[2];
			value1 = value1[1];
		}
		value1 = parseFloat(value1);
		if(Horizon._regex.unit.test(value2)) {
			value2 = Horizon._regex.unit.exec(value2);
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

	// Init Horizon scene
	horizon._scene = scene || document;
	W.addListener(horizon.detectSceneDimensions)();
	
	// Init default renderer
	var name;
	for(name in Horizon._renderers) {
		horizon.setDefaultRenderer(name);
	}
	
	// Init input functions
	var createInputFunc = function(name) {
		return function(node, callback) {
			horizon.initInput(name);
			if(!(name in horizon._callbacks)) {
				horizon._callbacks[name] = [];
			}
			if(typeof node == 'function') {
				horizon._callbacks[name].push({
					node: {},
					callback: node
				});
			}
			else {
				horizon._callbacks[name].push({
					node: node,
					callback: callback
				});
			}
		};
	};
	for(name in Horizon._inputs) {
		horizon[name] = createInputFunc(name);
	}
	
	// Init plugins
	for(var i=0, j=Horizon._plugins.length; i<j; ++i) {
		Horizon._plugins[i](horizon);
	}
	
	return horizon;
};

/*
	Register a renderer

	Parameters
		Function func
*/
Horizon._registerPlugin = function(func) {
	Horizon._plugins.push(func);
};

/*
	Register a renderer

	Parameters
		String name
		Function func
*/
Horizon._registerRenderer = function(name, func) {
	Horizon._renderers[name.toLowerCase()] = func;
};

/*
	Register an input plugin

	Parameters
		String name
		Object object
*/
Horizon._registerInput = function(name, object) {
	Horizon._inputs[name.toLowerCase()] = object;
};

/*
	Listen for events

	Parameters
		Array events
		Object node
		Function callback
*/
Horizon._listen = function(events, node, callback) {
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
Horizon._addCSSRule = function(selector, rules) {
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
Horizon._requestAnimationFrame = function(func) {
	if(!('requestAnimationFrame' in window)) {
		window.requestAnimationFrame = window.mozRequestAnimationFrame ||
										window.webkitRequestAnimationFrame ||
										window.msRequestAnimationFrame ||
										function(func) { func(); };
	}
	window.requestAnimationFrame(func);
};

// Init global variables
Horizon._renderers = {};
Horizon._inputs = {};
Horizon._plugins = [];
Horizon._regex = {
	unit: /(\d+(?:\.\d+)?)([a-z]+|%)/i,
	list: /^(?:\s*([\w.]+)\s*)(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?$/,
	hexa: /#(\w{2})(\w{2})(\w{2})/i,
	rgba: /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
	hsla: /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/
};

// Export module
module.exports = Horizon;
},{"../node_modules/pyrsmk-w/W.min.js":1}]},{},[2])(2)
});