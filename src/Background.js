var Horizon = require('Horizon').getInstance();

Horizon._registerPlugin('background', function() {
	// Override background()
	Horizon.__proto__.background = function(node, url) {
		node.style.backgroundImage = 'url(' + url + ')';
		node.style.backgroundSize = '105%';
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