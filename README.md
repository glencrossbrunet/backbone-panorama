# backbone-panorama

> declarative Backbone views

### Render

Backbone comes with `render` as a no-op. Panorama overrides `render` with more powerful defaults. Views will now trigger before and after events and render a declared template with declared template data.

For example, you may render child views after the main view has rendered:

```js
Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, "renderChildren");
    this.on("render:after", this.renderChildren);    
  },
  
  renderChildren: function() {
    // render this.collection
  }

});
```

Calling `view.render()` will trigger the callback. I find this useful for manually triggering `add` events on a collection to which the view is listening to render lists. 

#### `render:before`

Triggered before the view is rendered. It does not pass any parameters.

#### `render:after`

Triggered after the view has rendered. It does not pass any parameters.


### Template Data

You may define template data. By default it returns the associated model as json, or an empty object. 

```js
  templateData: function() {
    return { active: this.isActive() };
  }
```

You may also use a raw object if it doesn't need to be generated each time.

```js
  templateData: {
    provider: "facebook",
    color: "blue"
  }
```

Template data passed directly to the render invocation will take precedence over the template data.

```js
view.render({ color: "deepblue" })   // overrides "blue"
```

### Declaring Templates

Instead of defining a template function on each view, Panorama defines a `template` function on `Backbone.View` itself. That way each view declares it's template's name, which works well with automatic template injecting and compiling. 

```js
Backbone.View.template = function(name) {
  // override to do what you must
};
```

By default it expects templates to be precompiled on the `window.JST` object, or to be passed a precompiled template (i.e. passed a function).

```js
  template: "foldername/templatename"
  
  // or
  
  template: _.template("<%= name %>")
```

For inspiration on how to get the templates into JST see my article http://www.ajostrow.me/thoughts/organizing-client-templates. I tend to dynamically generate script tags from the application's templates folder on the server and include them with the page.

### Events

DOM events are re-bound when the view is rendered. This sounds obvious, but normally when the HTML of the view node is replaced, declared click handlers on DOM elements within the view node will never fire. 

```
  events: {
    "click #action": "viewMethod"
  },
  
  viewMethod: function(ev) {
    // this is never called if you're not using Panorama
  }
```

### Close

Backbone views get a `close` method that accepts an optional jQuery event to stop event propagation. This allows for declarative close click handlers. 

```
  events: {
    'click .close': 'close'
  }
```

## Notes

To use Panorama, copy the `backbone.panorama.js` file to your project, and include the script after Backbone.

```html
<script src="/path/to/backbone.js"></script>
<script src="/path/to/backbone.panorama.js"></script>
```

### License

MIT

---

AJ Ostrow, November 2013