/*! Horizon 2.0.8 (https://github.com/pyrsmk/Horizon) */

import '../node_modules/gsap/src/uncompressed/TweenLite.js';
import '../node_modules/gsap/src/uncompressed/plugins/CSSPlugin.js';
import '../node_modules/gsap/src/uncompressed/easing/EasePack.js';
var W = require('../node_modules/pyrsmk-w/W.min.js');

/*
	Horizon class
*/
class Horizon {
	
	/*
		Constructor
	*/
	constructor() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.callbacks = {};
		this.plugins = {};
		this.disabled_plugins = [];
		this.viewport = {width: 0, height: 0};
		this.layout = {width: 0, height: 0};
		this.orientation = 'landscape';
		this.boundaries = false;
		this.regex = {
			unit: /(\d+(?:\.\d+)?)([a-z]+|%)/i,
			list: /^(?:\s*([\w.]+)\s*)(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?(?:\s*([\w.]+)\s*)?$/,
			hexa: /#(\w{2})(\w{2})(\w{2})/i,
			rgba: /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/,
			hsla: /hsla?\(\s*(\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*(?:,\s*(\d+(?:\.\d+)?)\s*)?\)/
		};
		this.detectViewport();
		this.detectLayout();
		var that = this;
		W.addListener(function() {
			that.detectViewport();
			that.detectLayout();
			that.detectOrientation();
		});
	}
	
	/*
		Detect the viewport dimensions
	*/
	detectViewport() {
		this.viewport.width = W.getViewportWidth();
		this.viewport.height = W.getViewportHeight();
	}
	
	/*
		Detect the layout dimensions
	*/
	detectLayout() {
		this.layout.width = Math.max(
			document.body ? document.body.scrollWidth : 0,
			document.body ? document.body.offsetWidth : 0,
			document.documentElement.clientWidth,
			document.documentElement.scrollWidth,
			document.documentElement.offsetWidth
		);
		this.layout.height = Math.max(
			document.body ? document.body.scrollHeight : 0,
			document.body ? document.body.offsetHeight : 0,
			document.documentElement.clientHeight,
			document.documentElement.scrollHeight,
			document.documentElement.offsetHeight
		);
	}
	
	/*
		Detect device orientation
	*/
	detectOrientation() {
		this.orientation = W.getOrientation();
	}
	
	/*
		Register a plugin
		
		Parameters
			String name
			Function constructor
			Function setter
	*/
	_registerPlugin(name, constructor, setter) {
		constructor.loaded = false;
		this.plugins[name] = {
			constructor: constructor,
			setter: setter
		};
		var that = this;
		this.__proto__[name] = function(node, callback) {
			that.initPlugin(name);
			if(!(name in this.callbacks)) {
				this.callbacks[name] = [];
			}
			this.callbacks[name].push({
				node: node,
				callback: callback
			});
		};
	}
	
	/*
		Initialize a plugin
		
		Parameters
			String name
			Object options
	*/
	initPlugin(name, options) {
		if(!this.plugins[name].loaded) {
			this.plugins[name].constructor(options);
			this.plugins[name].loaded = true;
		}
	}
	
	/*
		Disable a plugin from rendering
		
		Parameters
			String name
	*/
	disablePlugin(name) {
		if(this.disabled_plugins.indexOf(name) == -1) {
			this.disabled_plugins.push(name);
		}
	}
	
	/*
		Enable a plugin that has been previously disabled
		
		Parameters
			String name
	*/
	enablePlugin(name) {
		this.disabled_plugins.splice(this.disabled_plugins.indexOf(name), 1);
	}
	
	/*
		Set coords for the specified plugin
		
		Parameters
			String name
			Object options
	*/
	setXY(name, options) {
		if(typeof this.plugins[name].setter == 'function') {
			this.plugins[name].setter(options);
		}
	}
	
	/*
		Add a parallax animation
		
		Parameters
			Array plugins
			Object node
			Function callback
	*/
	parallax(plugins, node, callback) {
		for(let i=0, j=plugins.length; i<j; ++i) {
			if(!(plugins[i] in this)) {
				throw new Error("'"+plugins[i]+"' plugin is not registered");
			}
			this[plugins[i]](node, callback);
		}
	}
	
	/*
		Interpolate a value
		
		Parameters
			Number position
			Object interpolations
		
		Return
			Object
	*/
	interpolate(position, interpolations) {
		// Get indexes
		let indexes = Object.keys(interpolations).sort(function(a, b) {
			return a - b;
		});
		// Compute values
		let properties = {},
			values1,
			values2,
			values3;
		for(let i=0, j=indexes.length; i<j; ++i) {
			// We found 2 available points
			if(i + 1 < j) {
				// First element
				if(i == 0 && position <= indexes[i]) {
					for(let name in interpolations[indexes[i]]) {
						properties[name] = interpolations[indexes[i]][name];
					}
					break;
				}
				// Next elements
				if(position >= indexes[i] && position <= indexes[i+1]) {
					for(let name in interpolations[indexes[i]]) {
						// Apply interpolations
						for(let type in this.regex) {
							if(type == 'unit') {
								continue;
							}
							if(
								this.regex[type].test(interpolations[indexes[i]][name]) &&
								this.regex[type].test(interpolations[indexes[i+1]][name])
							) {
								// Extract values
								values1 = this.regex[type].exec(interpolations[indexes[i]][name]);
								values2 = this.regex[type].exec(interpolations[indexes[i+1]][name]);
								values1.shift();
								values2.shift();
								// Interpolate values
								values3 = [];
								for(let k=0, l=values1.length; k<l; ++k) {
									if(typeof values1[k] != 'undefined' && typeof values2[k] != 'undefined') {
										if(type == 'hexa') {
											values3.push(this._interpolateValue(
												parseInt(values1[k],16),
												parseInt(values2[k],16),
												indexes[i],
												indexes[i+1],
												position
											));
										}
										else {
											values3.push(this._interpolateValue(
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
										let a = Math.round(values3[0]).toString(16),
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
				for(let name in interpolations[indexes[i]]) {
					properties[name] = interpolations[indexes[i]][name];
				}
			}
		}
		return properties;
	}
	
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
	_interpolateValue(value1, value2, index1, index2, position) {
		// Normalize values
		let unit1 = '', unit2 = '', value3;
		if(this.regex.unit.test(value1)) {
			value1 = this.regex.unit.exec(value1);
			unit1 = value1[2];
			value1 = value1[1];
		}
		value1 = parseFloat(value1);
		if(this.regex.unit.test(value2)) {
			value2 = this.regex.unit.exec(value2);
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
	}

	/*
		Render elements
		
		Parameters
			Object args {
				event,
				x,
				y,
				duration,
				easing
			}
	*/
	render(args) {
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
			args.x = this.x + args.x;
			args.y = this.y + args.y;
			args.z = this.z + args.z;
		}
		// Refresh the viewport dimensions
		this.detectViewport();
		// Limit x/y to the layout boundaries
		if(this.boundaries) {
			if(args.x < 0) {
				args.x = 0;
			}
			else if(args.x > this.layout.width) {
				args.x = this.layout.width;
			}
			if(args.y < 0) {
				args.y = 0;
			}
			else if(args.y > this.layout.height) {
				args.y = this.layout.height;
			}
		}
		// Generate animations
		if(!('plugin' in args) || this.disabled_plugins.indexOf(args.plugin) == -1) {
			let options, left, top, width, height,
				element, that = this;
			for(let plugin in this.callbacks) {
				if(!('plugin' in args) || args.plugin == plugin) {
					for(let i=0, j=this.callbacks[plugin].length; i<j; ++i) {
						element = this.callbacks[plugin][i];
						// Define callback parameters
						let params = {
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
						params.right = left - this.viewport.width + width;
						params.centerX = left - ((this.viewport.width - width) / 2);
						params.top = top;
						params.bottom = top - this.viewport.height + height;
						params.centerY = top - ((this.viewport.height - height) / 2);
						// Limit x/y to the layout boundaries
						if(this.boundaries) {
							if((params.x + width) > this.layout.width) {
								params.x = this.layout.width - width;
							}
							if((params.y + height) > this.layout.height) {
								params.y = this.layout.height - height;
							}
						}
						// Populate options
						options = element.callback(params);
						if(!options) {
							continue;
						}
						// Define animation options
						options.autoCSS = true;
						options.ease = options.ease || args.easing;
						if(options.duration) {
							args.duration = options.duration;
							delete options.duration;
						}
						// Animate
						TweenLite.to(element.node, args.duration, options);
					}
				}
			}
		}
		// Update scene position
		this.x = Math.abs(args.x); // abs() especially needed by Swipe
		this.y = Math.abs(args.y);
		this.z = Math.abs(args.z);
	}
	
	/*
		Listen for events
		
		Parameters
			Array events
			Function callback
	*/
	_listen(events, callback) {
		for(let i=0, j=events.length; i<j; ++i) {
			if(window.addEventListener) {
				window.addEventListener(events[i], callback, false);
			}
			else{
				window.attachEvent('on' + events[i], callback);
			}
		}
	}
	
	/*
		Add CSS rules in our own stylesheet
	*/
	_addCSSRule(selector, rules) {
		if(!('sheet' in this)) {
			var style = document.createElement('style');
			style.appendChild(document.createTextNode('')); // Webkit
			document.head.appendChild(style);
			this.sheet = style.sheet;
		}
		if('insertRule' in this.sheet) {
			this.sheet.insertRule(selector + '{' + rules + '}', 0);
		}
		else if('addRule' in this.sheet) {
			this.sheet.addRule(selector, rules, 0);
		}
	}
	
	/*
		RequestAnimationFrame wrapper
		
		Parameters
			Function func
	*/
	_requestAnimationFrame(func) {
		if(!('requestAnimationFrame' in window)) {
			window.requestAnimationFrame = window.mozRequestAnimationFrame ||
											window.webkitRequestAnimationFrame ||
											window.msRequestAnimationFrame ||
											function(func) { func(); };
		}
		window.requestAnimationFrame(func);
	}

}

export default Horizon;