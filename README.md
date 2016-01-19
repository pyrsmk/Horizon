Horizon 2.0.7
=============

Horizon is an ES6 parallax animation library, aiming to be robust and as flexible as possible. It's based on [GSAP](http://greensock.com/gsap), [Impetus](https://github.com/chrisbateman/impetus) and [W](https://github.com/pyrsmk/W).

It currently supports :

- X/Y/Z axes
- 2D/3D contexts
- Scroll
- Mouse
- Mouse wheel
- Swipe (with mouse and touch events)
- Canvas2D engine
- Gyroscope (experimental)

Private/Commercial use
----------------------

Horizon will remain free for private use. Currently, it is free for commercial use too, until we launch the project website. The website will propose personal Horizon bundles, like Modernizr.

Install
-------

```
npm install pyrsmk-horizon
bower install pyrsmk-horizon
```

Pick Horizon and the needed plugins in the `build/` directory.

Examples
--------

- [mouse input + background plugin](http://examples.horizonjs.io/mouse+background.html)
- [scroll input + relative interpolations](http://examples.horizonjs.io/scroll+relative.html)
- [swipe input + 3D](http://examples.horizonjs.io/swipe+3d.html)
- [mouse wheel input + HSLA parallaxing](http://examples.horizonjs.io/wheel+hsla.html)
- [gyroscope input + swipe input](http://examples.horizonjs.io/gyro+swipe.html)
- [canvas2d + scroll input](http://examples.horizonjs.io/canvas2d+scroll.html)

Basics
------

Parallax is a state applied to an element according to the state of an input (like the scroll or the mouse). Horizon applies that simple principle to its API. You just need to know the input to handle (supported by Horizon's plugins) and the node to animate :

```js
Horizon.scroll($('.square')[0], function(args) {
	return {
		top: args.x,
		left: args.y
	};
});
```

Here, the `Scroll` plugin is passing its axis values through the `args` argument. As you may see, you can easily specify X axis for an Y coord property, and vice versa.

The returned properties are applied to the element by [GSAP](http://greensock.com/gsap), a highly optimized animation library. To know how properties are handled by GSAP, please refer to the [documentation](http://greensock.com/docs/#/HTML5/GSAP/Plugins/CSSPlugin/). If needed, you can override the `duration` and `ease` parameters.

If needed, you can specify several plugins at once :

```js
Horizon.parallax(['scroll', 'mouse'], node, function(args) {
	// blah blah
});
```

Horizon is working with the whole document as a scene. It means you currently can't wrap the scene in a node. But we've planned to support it in the far future.

Plugins
-------

### Basics

Plugins are automatically registered, and initialized when parallax callbacks are registered. Sometimes, you may want to initialize them by yourself for, per example, pass options to them. See the `Swipe` section to have a look at how to do it.

Each example in this section is provided with the supported axes returned by the plugin. Unused axes

### Scroll

```js
Horizon.scroll(node, function(args) {
	return {
		left: args.x,
		top: args.y
	};
});
```

### Mouse

```js
Horizon.mouse(node, function(args) {
	return {
		left: args.x,
		top: args.y
	};
});
```

### Mouse wheel

Here, `args.x` has the same value as `args.y`.

```js
Horizon.wheel(node, function(args) {
	return {
		top: args.y
	};
});
```

### Swipe

```js
Horizon.swipe(node, function(args) {
	return {
		left: args.x,
		top: args.y
	};
});
```

If needed, you can initialize this plugin with arguments for [Impetus](https://github.com/chrisbateman/impetus).

```js
// Limit the Y axis when swiping
Horizon.initPlugin('swipe', {
	boundY: [-Horizon.layout.height, 0]
});
```

### Background

The `Background` plugin is a special plugin that lets you make a background covered image moves according to the `Mouse` input.

```js
// The node parameter, is the node where the background is applied (it's the body, most of the time)
Horizon.background(node, 'background.jpg');
```

You can specify how wide your background should be. The value is the background size in percent (the default value is `105`) :

```js
// This will show a moving tiled background
Horizon.background(node, 'background.jpg', 20);
```

### Canvas2D

The `Canvas2D` engine is known to be really efficient and we chose to implement it in Horizon, so you can use it to display parallaxed images with powered by hardware acceleration.

The way you can run it in Horizon is a bit different than the other plugins. First, define your `canvas` element and the images to load (it's not needed, but we're defining a `factor` data attribute so we can easily define our image parameters).

```html
<!-- We advise you to hide your images in CSS -->
<img src="images/img1.jpg" data-factor="-0.4">
<img src="images/img2.jpg" data-factor="-0.2">
<img src="images/img3.jpg" data-factor="0.3">
<canvas class="scene" width="600" height="600"></canvas>
```

Then, you need to register the scene and the images you want to parallax.

```js
Horizon.canvas2d($('.scene')[0], $('img'));
```

Now that all is linked as well, we can animate our images. To accomplish this, we won't animate the node itself but its `canvas2d` property, that we must initialize by ourselves.

Please note that all usual properties that we can animate with the other plugins are not supported. Here's the available ones :

- left : integer
- top : integer
- scale : {x, y}
- rotation : integer (in degrees)
- opacity : float (between 0 and 1)

```js
$('.img').forEach(function() {
	// Initialize the canvas2d object
	// (all properties are not required, it depends on what you want to animate)
	image.canvas2d = {
		left: 0,
		top: 0,
		opacity: 0,
		roation: 0
	};
	image.canvas2d.left = left;
	image.canvas2d.top = top;
	image.canvas2d.opacity = 0;
	image.canvas2d.rotation = 0;
	// Parallax with scroll
	Horizon.scroll(this.canvas2d, function(args) {
		var factor = parseFloat($(this).data('factor'));
		return {left: args.x * factor};
	});
});
```

If you want to see how `Canvas2D` si working in live, please [see this example](http://horizonjs.io/examples/canvas2d+scroll.html).

Note : you should never set the `width` and `height` of your `canvas` element in CSS (unless you know what you're doing); instead define the node `width` and `height` attributes

### Gyroscope

The gyroscope is an experimental feature in Horizon. And it will probably stay experimental as it seems there's no consistant API for the time. In fact, the axis of the physical gyroscope is fixed on the device while the axis based on the screen rotation is not fixed at all, then the returned X/Y values aren't always reliable.

```js
Horizon.gyro(node, function(args) {
	return {
		left: args.x,
		top: args.y,
		rotation: args.z
	};
});
```

We also advise you to set `Horizon.boundaries` to `true`.

Interpolations
--------------

### Basics

Now, we know how to use each kind of plugin and how to set simple parallaxes. But how can we set complex animations like we can do with CSS `keyframes`? Horizon's covering this behavior with its `interpolate()` method. We can create interpolations by setting the current position from the input, and the interpolations themselves.

```js
Horizon.swipe(node, function(args) {
	return Horizon.interpolate(args.y, {
		0: {top: 200},
		100: {top: 600},
		300: {top: 300}
	});
});
```

The node will translate from `200` to `600` when the Y axis is progressing from `0` to `100`, and the node is going back to `300`.

### Which values are interpolated?

- any integer value, with a unit or not
- rgba()
- hsla()
- HTML colors (in the `#000000` form)

### Relative context

First, [take a look at this example](http://horizonjs.io/examples/scroll+relative.html) (scroll down the page to see the block in action).

Relative context is useful when you want to create interpolations based on the position of your block against the viewport. We can accomplish that by using relative arguments passed by the plugin.

```js
Horizon.scroll(node, function(args) {
	var interpolations = {};
	
	interpolations[args.centerY - 300] = {scaleX: 1, opacity: 0};
	interpolations[args.centerY] = {scaleX: 5, opacity: 1};
	interpolations[args.centerY + 300] = {scaleX: 1, opacity: 0};
	
	return Horizon.interpolate(args.y, interpolations);
});
```

The available arguments are :

- left : the position where the left of the block crosses the left of the viewport
- right : the position where the right of the block crosses the right of the viewport
- top : the position where the top of the block crosses the top of the viewport
- bottom : the position where the bottom of the block crosses the bottom of the viewport
- centerX : the position where the center of the block crosses the center of the viewport on the X axis
- centerY : the position where the center of the block crosses the center of the viewport on the Y axis

Viewport/layout handling
------------------------

The `Scroll` and `Mouse` plugins are limited in their X/Y axes by their technical behavior. There's no way we can go out of bounds. But that's not the case with, per example, the `Wheel` and `Swipe` plugins : we can have negative values, or values that are greater than your layout. Then, we could need to limit those values. It can be done with :

```js
Horizon.boundaries = true;
```

The layout is automatically computed by Horizon, but the values can be wrong, depending on your configuration. You can fix them like this :

```js
Horizon.layout = {
	width: 1500,
	height: 200
};
```

If needed you can access some viewport values :

```js
// Will echo, per example, {width: 1920, height: 1080}
console.log(Horizon.viewport);

// Will echo 'portrait' or 'landscape'
console.log(Horizon.orientation);
```

When your layout or viewport is modified (because the user has resized its browser or, per example, he changed his device orientation), Horizon's automatically detecting the new configuration by calling :

```js
Horizon.detectViewport();
Horizon.detectLayout();
Horizon.detectOrientation();
```

But in some cases, please note that you may need to call these functions by yourself.

Advanced use
------------

### Trigger manual coords

You can trigger any input with the X/Y values you want. It's really useful when you need to centralize several inputs coords, per example.

```js
// Scroll to 100 on the X axis
Horizon.setXY('scroll', {x: 100});
```

### Disable plugins

You can disable plugins from rendering at any moment with :

```js
Horizon.disablePlugin('mouse');
```

And enable them again with :

```js
Horizon.enablePlugin('mouse');
```

License
-------

Published under the [MIT license](http://dreamysource.mit-license.org).
