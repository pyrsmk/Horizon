Horizon._registerPlugin('canvas2d', function() {
	// Override canvas2d()
	Horizon.canvas2d = function(scene, images) {
		// Get context
		var canvas2d = scene.getContext('2d');
		// Animation loop
		TweenLite.ticker.addEventListener('tick', function() {
			// Clear the scene
			canvas2d.clearRect(0, 0, canvas2d.canvas.width, canvas2d.canvas.height);
			// Draw images
			for(var i=0, j=images.length; i<j; ++i) {
				// Get out!
				if(
					!images[i] ||
					typeof images[i] != 'object' ||
					!('nodeName' in images[i]) ||
					images[i].nodeName != 'IMG' ||
					!('canvas2d' in images[i])
				) {
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
		});
	};
});

Horizon.initPlugin('canvas2d');