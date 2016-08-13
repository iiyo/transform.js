# transform.js

Simple JavaScript transformations, e.g. for tweening, that can be paused, resumed and canceled.

## Installation

    npm install transform-js

## Usage

```javascript
var t = transformation(from, to, update, options, after);
```

* `t`: An object with methods to control the transformation.
* `from`: The start value.
* `to`: The end value.
* `update`: A function that receives the current value of the transformation.
* `options`: An object to configure the transformation (optional):
  * `duration`: Duration for the transformation.
  * `easing`: An easing function or name of an easing function from node package [eases](https://github.com/mattdesl/eases).
  * `fps`: Frames per second to use.
* `after`: Callback for when the transformation has stopped or is canceled (optional).

```javascript
var transformation = require("transform-js").transformation;
var t = transformation(0, 1000, update);

function update (newValue) {
    // ...
    console.log(newValue);
}

t.start();
```

### Canceling

You can cancel a transformation:

```javascript
t.cancel();
```

Canceling stops the transformation. The last value will be the current value of the transformation.

### Stopping

You can stop a running transformation:

```javascript
t.stop();
```

The last value will be the `to` value of the transformation.

### Pause/resume

A transformation can be paused and resumed:

```javascript
t.start();

setTimeout(function () {
    t.pause();
}, 500);

setTimeout(function () {
    t.resume();
}, 1000);
```

