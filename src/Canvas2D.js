Horizon._registerPlugin('canvas2d', function() {
	// Override canvas2d()
	Horizon.canvas2d = function(scene, images) {
		// Get context
		var canvas2d = scene.getContext('2d'),
			cache = [],
			isValid = function(node) {
				return node && typeof node == 'object' && 'nodeName' in node && node.nodeName == 'IMG' && 'canvas2d' in node;
			};
		// Animation loop
		TweenLite.ticker.addEventListener('tick', function() {
			var i, j, k,
				redraw = false;
			// Verify changes
			if(cache.length == 0) {
				redraw = true;
			}
			else {
				for(i=0, j=images.length; i<j; ++i) {
					if(isValid(images[i])) {
						if(typeof cache[i] == 'undefined') {
							redraw = true;
						}
						else {
							for(k in images[i].canvas2d) {
								if(k in cache[i]) {
									switch(k) {
										case 'left':
										case 'top':
										case 'rotation':
										case 'opacity':
											redraw = (images[i].canvas2d[k] != cache[i][k]);
											break;
										case 'scale':
											if(!('x' in images[i].canvas2d[k])) {
												images[i].canvas2d[k].x = 1;
											}
											if(!('y' in images[i].canvas2d[k])) {
												images[i].canvas2d[k].y = 1;
											}
											redraw = (images[i].canvas2d[k].x != cache[i][k].x && images[i].canvas2d[k].y != cache[i][k].y);
											break;
									}
								}
								else {
									redraw = true;
								}
								if(redraw) {
									break;
								}
							}
						}
						if(redraw) {
							break;
						}
					}
				}
			}
			// Register changes
			if(redraw) {
				for(i=0, j=images.length; i<j; ++i) {
					if(isValid(images[i])) {
						cache[i] = {};
						for(k in images[i].canvas2d) {
							switch(k) {
								case 'left':
								case 'top':
								case 'rotation':
								case 'opacity':
									cache[i][k] = images[i].canvas2d[k];
									break;
								case 'scale':
									if(!('x' in images[i].canvas2d[k])) {
										images[i].canvas2d[k].x = 1;
									}
									if(!('y' in images[i].canvas2d[k])) {
										images[i].canvas2d[k].y = 1;
									}
									cache[i][k] = {x: images[i].canvas2d[k].x, y: images[i].canvas2d[k].y};
									break;
							}
						}
					}
				}
			}
			// Draw the scene
			if(redraw) {
				// Clear the scene
				canvas2d.clearRect(0, 0, canvas2d.canvas.width, canvas2d.canvas.height);
				// Draw images
				for(i=0, j=images.length; i<j; ++i) {
					// Verify node integrity
					if(!isValid(images[i])) {
						continue;
					}
					// Pre-render image
					if(!('cache' in images[i])) {
						var c = document.createElement('canvas');
						c.width = images[i].width;
						c.height = images[i].height;
						c.getContext('2d').drawImage(images[i], 0, 0);
						images[i].cache = c;
					}
					// Save state
					canvas2d.save();
					// Scale image
					if('scale' in images[i].canvas2d) {
						canvas2d.scale(images[i].canvas2d.scale.x, images[i].canvas2d.scale.y);
					}
					// Apply rotation
					if('rotation' in images[i].canvas2d) {
						var x = images[i].canvas2d.left + (images[i].width / 2),
							y = images[i].canvas2d.top + (images[i].height / 2);
						canvas2d.translate(x, y);
						canvas2d.rotate(images[i].canvas2d.rotation * Math.PI / 180);
						canvas2d.translate(-x, -y);
					}
					// Apply opacity
					if('opacity' in images[i].canvas2d) {
						canvas2d.globalAlpha = images[i].canvas2d.opacity;
					}
					// Draw image
					canvas2d.drawImage(
						images[i].cache,
						images[i].canvas2d.left,
						images[i].canvas2d.top
					);
					// Restore state
					canvas2d.restore();
				}
			}
		});
	};
});

Horizon.initPlugin('canvas2d');