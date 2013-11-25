# backbone-panorama

> declarative Backbone views

### Render

Backbone comes with `render` as a no-op. Panorama overrides `render` with more powerful defaults. Views will now trigger before and after events and render a declared template with declared template data.

For example, you may render child views after the main view has rendered:

```js
Backbone.View.extend({

  initialize: function() {
    _.bindAll(this, 'renderChildren');
    this.on('render:after', this.renderChildren);    
  },
  
  renderChildren: function() {
    // render this.collection
  }

});
```

Calling `view.render()` will trigger the callback. I find this useful for manually triggering `add` events on a collection to which the view is listening to render lists. 

### Template Data

You may define template data to be rendered with the template. By default it returns the associated model as json, or an empty object. 

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
view.render({ color: 'deepblue' })
```

### Declaring Templates

Instead of defining a template function on each view, Panorama defines a `template` function on `Backbone.View` itself. That way each view declares it's template's name, which works well with automatic template injecting and compiling. It expects templates to be precompiled on the `window.JST` object.

```js
Backbone.View.template = function(name) {
  // override to do what you must
};
```

```js
  template: 'foldername/templatename'
```

For inspiration on how to get the templates into JST see my article http://www.ajostrow.me/thoughts/organizing-client-templates. I tend to dynamically generate script tags from the application's templates folder.

### Events

#### `render:before`

Triggered before the view is rendered. It does not pass any parameters.

#### `render:after`

Triggered after the view has rendered. It does not pass any parameters.

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