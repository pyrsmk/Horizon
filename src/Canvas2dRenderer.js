// Register Canvas2D renderer
Horizon._registerRenderer('canvas2d', function(horizon, args) {
	if('scene' in args.node) {
		args.properties.ease = args.easing;
		args.properties.onUpdate = function() {
			args.node.scene.redraw = true;
		};
		if(typeof args.complete == 'function') {
			args.properties.onComplete = args.complete;
		}
		TweenLite.to(args.node, args.duration / 1000, args.properties);
	}
});

// Register some methods
Horizon._registerPlugin(function(horizon) {
	// Verify if the canvas element is supported
	horizon.isCanvasSupported = function() {
		var canvas = document.createElement('canvas');
		return !!(canvas.getContext && canvas.getContext('2d'));
	};
	// Initialize the renderer
	horizon.initCanvas2D = function(scene) {
		// Prepare
		var images = [],
			context = scene.getContext('2d');
		scene.redraw = false;
		// Add an image for displaying in the scene
		scene.addImage = function(node, properties, index) {
			properties.node = node;
			properties.scene = scene;
			properties.offsetLeft = properties.left || 0;
			properties.offsetTop = properties.top || 0;
			properties.offsetWidth = 0;
			properties.offsetHeight = 0;
			if(index !== undefined) {
				images[index] = properties;
			}
			else {
				images.push(properties);
			}
		};
		// Remove an image
		scene.removeImage = function(index) {
			delete images[index];
		};
		// Clear all images
		scene.clearImages = function(index) {
			images = [];
		};
		// Init drawing routine
		TweenLite.ticker.addEventListener('tick', function() {
			// Redraw or not
			if(!scene.redraw) {
				return;
			}
			scene.redraw = false;
			// Clear the scene
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			// Draw images
			for(var i=0, j=images.length; i<j; ++i) {
				// Verify that the index is reachable
				if(typeof images[i] == 'undefined') {
					continue;
				}
				// Pre-render image
				if(!('cache' in images[i])) {
					if(!images[i].node.width) {
						continue;
					}
					var c = document.createElement('canvas');
					c.width = images[i].offsetWidth = images[i].naturalWidth = images[i].node.width;
					c.height = images[i].offsetHeight = images[i].naturalHeight = images[i].node.height;
					c.getContext('2d').drawImage(images[i].node, 0, 0);
					images[i].cache = c;
				}
				// Save state
				context.save();
				// Scale image
				if('scale' in images[i]) {
					images[i].offsetWidth = images[i].naturalWidth * images[i].scale;
					images[i].offsetHeight = images[i].naturalHeight * images[i].scale;
					context.scale(images[i].scale, images[i].scale);
				}
				// Apply rotation
				if('rotate' in images[i]) {
					var x = images[i].left + (images[i].offsetWidth / 2),
						y = images[i].top + (images[i].offsetHeight / 2);
					context.translate(x, y);
					context.rotate(images[i].rotate * Math.PI / 180);
					context.translate(-x, -y);
				}
				// Apply opacity
				if('opacity' in images[i]) {
					context.globalAlpha = images[i].opacity;
				}
				// Update position
				images[i].offsetLeft = images[i].left || 0;
				images[i].offsetTop = images[i].top || 0;
				// Draw image
				context.drawImage(
					images[i].cache,
					images[i].offsetLeft,
					images[i].offsetTop
				);
				// Restore state
				context.restore();
			}
		});
	};
});