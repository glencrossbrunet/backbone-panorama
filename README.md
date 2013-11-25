# backbone-panorama

> declarative Backbone views

### Rendering

Backbone comes with `render` as a no-op. Panorama makes overrides `render` with more powerful defaults. Views will now trigger before and after events and render a declared template.

Templates should be declared in the view definition:

```js
Backbone.View.extend({
  template: 'template/name'
});
```

Instead of defining a template function on each view, Panorama defines a template function on `Backbone.View` itself. That way each view can declare the name of the template, which works well with automatic template injecting and compiling.  

By default `Backbone.View.template('template/name')` will return `window.JST['template/name']`. Feel free to override this behavior though. 

```js
Backbone.View.template = function(name) {
  // do what you must
};
```

### Events

#### `render:before`

Triggered before the view is rendered. It does not pass any parameters.

#### `render:after`

Triggered after the view has rendered. It does not pass any parameters.