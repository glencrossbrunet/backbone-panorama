# backbone-panorama ![Build Status](https://travis-ci.org/glencrossbrunet/backbone-panorama.png?branch=master)

> declarative Backbone views

### Render

Backbone comes with `render` as a no-op. Panorama overrides `render` with more powerful defaults. Views trigger before and after events and render a declared template with declared template data.

#### `render:before` and `render:after`

> Triggered before the view is rendered. No parameters are passed.

Example usage could be fading in after the html is rendered. 

```js
Backbone.View.extend({

  initialize: function() {
    this.on("render:after", this.fadeIn, this);
  },
  
  fadeIn: function() {
    this.$el.fadeIn("slow");
  }

});
```

We'll get into templates and template data further down the page. 

### Events

DOM events are re-bound when the view is rendered. This sounds obvious, but normally when the HTML of the view node is replaced, declared click handlers on DOM elements within the view node will never fire. 

```
  events: {
    "click #action": "handler"
  },
  
  handler: function(ev) {
    // this would never be called with normal backbone views
  }
```

Panorama augments the `trigger` method so that all events can be declared in the events object. 

```
  events: {
    "render:after": "fadeIn"
  }
```

Custom events may be declared and triggered as well. 

```
  events: {
    "custom": "customMethod"
  }
```

```
view.trigger("custom");
```

### Template Data

Template data by default is the associated model as json, or an empty object if there is no model. It usually should be overridden to provide the data needed for rendering the template. 

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

### Template

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

### Close

Views get a `close` method that accepts an optional jQuery event to prevent propagation. This allows for declarative close click handlers. 

```
  events: {
    "click .close": "close"
  }
```

Close fires before and after events much like render.

#### `close:before` and `close:after`

> Triggered before the view is closed and after the view remove method has settled. No parameters are passed.

Calling `close` in turn calls `remove` so custom animations may be used instead of the default view removal.

```
  remove: function() {
    return this.$el.delay(50).fadeOut("slow");
  }
```

When a view is closed, it is assumed is should be destroyed for good. Panorama makes sure all objects attached to the view remove events. Even so, try to stick to `listenTo` syntax instead of binding view events to the model. 

```
  initialize: function() {
    this.listenTo(this.model, "change", this.render);  // good
    
    this.model.on("change", this.render, this);        // discouraged, will be ok
    
    this.model.on("change", this.render.bind(this));   // bad, will leave a zombie view
  }
```

### Add

Most apps of size need to render hierarchies of views and gracefully close them. The `add` method helps by rendering the child view and setting up a listener to close the child view when the parent view is re-rendered or closed. 

```js
   initialize: function() {
     this.listenTo(this.collection, "add", this.add);
   }
```

It defaults to appending the rendered child node inside the parent node. The DOM node and action may both optionally be specified.

```js
parent.add(view);                          // append to this.$el

parent.add(view, "#children");             // append to this.$('#children')

parent.add(view, "prepend");               // prepend to this.$el

parent.add(view, "prepend", "#children")   // prepend to this.$('#children')
```

Later if you render or close the parent view, the child view and all traces of it will safely disappear. 

```js
parent.render()
parent.close()                             // all child views closed
```

This allows one close button to remove an entire view hierarchy without any memory leaks (zombie views). 

## Notes

To use Panorama, copy the `backbone.panorama.js` file to your project, and include the script after Backbone.

```html
<script src="/path/to/backbone.js"></script>
<script src="/path/to/backbone.panorama.js"></script>
```

Please report any bugs or unexpected behavior so I can fix them! Pull requests with tests very much encouraged. Feel free to suggest new features as well.   

### License

MIT

---

AJ Ostrow, November 2013