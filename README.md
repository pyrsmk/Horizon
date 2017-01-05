Horizon 4.2.0
=============

Horizon is a parallax engine, aiming to be robust and as flexible as possible. It's based on [GSAP](http://greensock.com/gsap), [Impetus](https://github.com/chrisbateman/impetus) and [W](https://github.com/pyrsmk/W).

It currently supports :

- Scroll
- Mouse position
- Mouse wheel
- Swiping (with mouse and touch events)
- Canvas2D renderer
- Gyroscope
- WebGL

Install
-------

```
npm install pyrsmk-horizon
```

Examples
--------

- [Mouse input](http://examples.horizonjs.io/mouse+scene.html)
- [Scroll input + relative interpolations](http://examples.horizonjs.io/scroll+relative.html)
- [Mouse Wheel input + HSLA parallaxing](http://examples.horizonjs.io/wheel+hsla.html)
- [Gyroscope input + Swipe input](http://examples.horizonjs.io/gyroscope+swipe.html)
- [Scroll + Canvas2d](http://examples.horizonjs.io/scroll+canvas2d.html)
- [Swipe input + Transforms3D](http://examples.horizonjs.io/swipe+transforms3d.html)
- [Swipe + WebGL](http://examples.horizonjs.io/swipe+webgl.html)

Basics
------

Parallax is a state applied to an element according to the state of an input (like the scroll or the mouse). Horizon applies that simple principle to its API. You just need to know the input to handle (supported by Horizon's plugins) and the node to animate. But first, let's create an Horizon object with the scene we want to handle :

```js
var horizon = new Horizon($('.scene')[0]);
```

The scene parameter is optional and Horizon will default to `document`. Now we can handle our parallax on some elements :

```js
horizon.scroll($('.square')[0], function(coords) {
	return {
		top: coords.x,
		left: coords.y
	};
});
```

The returned properties are applied to the element by the renderer. To know how properties are handled by GSAP (the default Horizon's renderer), please refer to the [documentation](http://greensock.com/docs/#/HTML5/GSAP/Plugins/CSSPlugin/). If needed, you can override the `duration` and `easing` parameters by returning them with the properties.

```js
horizon.scroll($('.square')[0], function(coords) {
	return {
		top: coords.y,
		duration: 1500
	};
});
```

If you want to handle several inputs for the same element, use :

```js
horizon.parallax(['scroll', 'mouse'], node, function(coords) {
	return {
		top: coords.y
	};
});
```

Note that passing a `node` parameter is not needed when you're calling input parallax functions, because you could just need to listen to parallax events.

```js
horizon.scroll(function(coords) {
	// Apply some actions according to the passed coords
});
```

The `coords` argument
---------------------

There's several values that are passed in this argument that you need to know :

- x : the absolute X coordinate
- y : the absolute Y coordinate
- z : the absolute Z coordinate
- relativeX : the relative X coordinate
- relativeY : the relative Y coordinate
- relativeZ : the relative Z coordinate

But there's also arguments for the relative context (see the `Interpolations` section below) :

- left : the position where the left of the block crosses the left of the viewport
- right : the position where the right of the block crosses the right of the viewport
- top : the position where the top of the block crosses the top of the viewport
- bottom : the position where the bottom of the block crosses the bottom of the viewport
- centerX : the position where the center of the block crosses the center of the viewport on the X axis
- centerY : the position where the center of the block crosses the center of the viewport on the Y axis

The scene
---------

The scene is where events are listened and your elements rendered. You can retrieve it with :

```js
horizon.getScene();
```

### Set manual coords

You can change the coords of your scene (and the state of the attached inputs) :

```js
horizon.setCoords({x: 100});
```

Note that if, per example, the scroll input is attached to your scene, then the scroll will move to the position of `100px` too.

You can get the current scene coords with :

```js
horizon.getCoords();
```

### Set boundaries

The `Scroll` and `Mouse` plugins are limited in their X/Y axes by their technical behavior. There's no way we can go out of bounds. But that's not the case with, per example, the `Wheel` and `Swipe` plugins : we can encounter values that are greater than the layout. According to your needs, you can limit your scene with :

```js
// The X axis will be limited from 0 to 1600
horizon.setBoundaries({
	x: [0, 1600]
});
```

Boundaries can be applied to `x`, `y` and `z` axes.

You can get the current boundaries with :

```js
horizon.getBoundaries();
```

### Scene dimensions

The scene dimensions are used internally by Horizon to know how compute many things (like the relative context for interpolations). The dimensions are automatically detected when the viewport is resized, but you could need to trigger it by yourself (after you made some manual changes to the scene, per example) :

```js
horizon.detectSceneDimensions();
```

You can retrieve these dimensions with :

```js
horizon.getSceneWidth();
horizon.getSceneHeight();
```

Interpolations
--------------

### Basics

Now, we know how to use each kind of plugin and how to set parallax. But how can we set complex animations like we can do with CSS `keyframes`? Horizon's covering this behavior with its `interpolate()` method.

```js
horizon.swipe(node, function(coords) {
	return Horizon.interpolate(coords.y, {
		0: {top: 200},
		100: {top: 600},
		300: {top: 300}
	});
});
```

The node will translate from `200` to `600` when the Y axis is progressing from `0` to `100`, then the node is going back to `300`.

### Which values are interpolated?

- any integer value, with a unit or not
- rgba()
- hsla()
- HTML colors (with the `#000000` form)

### Relative context

First, [take a look at this example](http://examples.horizonjs.io/scroll+relative.html) (scroll down the page to see the block in action).

Relative context is useful when you want to create interpolations based on the position of your block compared to your scene. We can accomplish this by using relative arguments passed in the `coords` argument?

```js
horizon.scroll(node, function(coords) {
	var interpolations = {};
	
	interpolations[coords.centerY - 300] = {scaleX: 1, opacity: 0};
	interpolations[coords.centerY] = {scaleX: 5, opacity: 1};
	interpolations[coords.centerY + 300] = {scaleX: 1, opacity: 0};
	
	return Horizon.interpolate(coords.y, interpolations);
});
```

The inputs
----------

### Basics

An in put is basically input events that Horizon is listening to. When a change is seen, parallax functions are triggered. If you're using several inputs in a Horizon object, all inputs state are changed to follow the global scene. That means if the scroll is triggered, and you're using the swipe input too, then the coordinates of the scroll input are applied to the swipe input. Then, all input states are centralized and Horizon keeps reliable.

### Disable inputs

You can disable input plugins from rendering at any moment with :

```js
horizon.disableInput('mouse');
```

And enable them again with :

```js
horizon.enableInput('mouse');
```

### Scroll input

```js
horizon.scroll(node, function(coords) {
	return {
		left: coords.x,
		top: coords.y
	};
});
```

If you want to smooth scroll to a specific position :

```js
horizon.smoothScroll({y: 500});
```

### Mouse input

```js
horizon.mouse(node, function(coords) {
	return {
		left: coords.x,
		top: coords.y
	};
});
```

### Mouse wheel input

Here, only the `Y` axis is returned.

```js
horizon.wheel(node, function(coords) {
	return {
		top: coords.y
	};
});
```

### Swipe input

```js
horizon.swipe(node, function(coords) {
	return {
		left: coords.x,
		top: coords.y
	};
});
```

If needed, you can initialize this plugin with arguments for [Impetus](https://github.com/chrisbateman/impetus) before calling `horizon.swipe()`. Note that `source`, `update`, `boundX` and `boundY` cannot be set since Horizon automatically handle them.

```js
horizon.initInput('swipe', options);
```

### Gyroscope input

```js
horizon.gyroscope(node, function(coords) {
	return {
		left: coords.x,
		top: coords.y,
		rotation: coords.z
	};
});
```

The gyroscope input adds a method to Horizon to know if the gyroscope is supported by the current device : `horizon.isGyroscopeSupported()`.

### WebGL

There's no `WebGL` input because you can handle it directly with the default renderer. Just load the library you want to use for your WebGL context (often [three.js](http://threejs.org)) and apply simple parallax :

```js
horizon.swipe(function(coords) {
	cube.rotation.x = -coords.y / 100;
	cube.rotation.y = -coords.x / 100;
	// Call your routine rendering function
	render();
});
```

Take a look at the source of this [simple example](http://examples.horizonjs.io/swipe+webgl.html) to better see how it's working.

The renderers
-------------

The renderer is the engine that will renderer your parallaxed elements. There are several available renderers in Horizon.

### Set the default renderer

If you want to use another renderer than the default one you can change it with :

```js
Horizon.setDefaultRenderer('canvas2d');
```

### Set renderer for a specific animation

Sometimes, you need to run an animation with a specific renderer, not the default one. Let's say we're using the `canvas2d` renderer as by default and we want to apply a parallax effect with the `GSAP` renderer :

```js
horizon.scroll(node, function(coords) {
	return {
		left: coords.x,
		renderer: 'gsap'
	};
});
```

### GSAP renderer

The GSAP renderer is the default renderer used by Horizon. Please read this [documentation page](http://greensock.com/docs/#/HTML5/GSAP/Plugins/CSSPlugin/) to learn more about how it's working.

### Canvas2D renderer

The `Canvas2D` renderer is known to be really efficient and we chose to implement it in Horizon, so you can use it to display parallaxed images powered by hardware acceleration. But note that even if Canvas2D is well supported in desktop browsers, that's not the case under mobile browsers. Then, we advise you to switch from the Canvas2D renderer to the GSAP renderer in a mobile context.

The Canvas2D plugin adds a method to Horizon to know if it's supported or not by the current browser :

```js
horizon.isCanvasSupported();
```

That's said, let's define our `canvas` element and an image to load :

```html
<img src="images/img.jpg" style="display: none;">
<canvas width="600" height="600"></canvas>
```

Now, you need to register the scene :

```js
var scene = $('canvas')[0];

// Init the scene
horizon.initCanvas2D(scene);
```

Calling `initCanvas2D()` on a scene will append some methods to it, as you will see. Let's add an image to the scene (for Canvas2D we're creating manual objects, we won't pass the image nodes directly) :

```js
scene.addImage($('img')[0], {left: 0});
```

The renderer also supports image order by accepting an index as the third parameter of `addImage()`. It allows the user to load its images asynchronously and keeps the index of each image when drawing them on the canvas.

You can remove a previously added image too by passing its index :

```js
scene.removeImage(10);
```

Or clear all images directly :

```js
scene.clearImages();
```

Please note that all usual properties that we can animate with the other plugins are not supported. Here's the available ones :

- left : integer
- top : integer
- scale : float (between 0 and 1)
- rotate : integer (in degrees)
- opacity : float (between 0 and 1)

```js
horizon.scroll(img, function(coords) {
	return {left: coords.x * 0.5};
});
```

If you want to see how `Canvas2D` is working in live, please [see this example](http://examples.horizonjs.io/scroll+canvas2d.html).

Note : you should never set the `width` and `height` of your `canvas` element in CSS (unless you know what you're doing); instead define the node's `width` and `height` attributes.

Manual rendering
----------------

You can render your scene by simply calling `horizon.render()`. Here's the available options (all optionals) :

- x : X coordinate to render
- y : Y coordinate to render
- z : Z coordinate to render
- duration : the duration in ms
- easing : the easing to apply (see this [page](http://greensock.com/docs/#/HTML5/GSAP/Easing/))
- trigger : the specific input to trigger
- complete : a callback which will be called when the rendering is complete

License
-------

Published under the [MIT license](http://dreamysource.mit-license.org).
