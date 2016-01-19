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