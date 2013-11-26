// Backbone Panorama v0.0.4
// (c) 2013 MIT License

(function(View) {
  
  _.extend(View, {
  
    template: function(name) {
      if (_.isFunction(name)) return name;
      return window.JST[name];
    }
  
  });
  
  function maybeOff(object, key) {
    var isListener = _.isObject(object) && _.isFunction(object.off);
    if (isListener && '$el' !== key) object.off(null, null, this);
  }
    
  _.extend(View.prototype, {
  
    close: function(ev) {
      if (ev && _.isFunction(ev.preventDefault)) ev.preventDefault();
      this.trigger('close:before');
      
      this.stopListening();
      _.each(this, maybeOff, this);
      this.remove();
      
      $(this.$el).promise().done(function() {
        this.trigger('close:after');
        this.off();
      }.bind(this));
      return this;
    },
  
    render: function(optionalData) {
      this.trigger('render:before');
    
      if (this.template) {
        var data = _.result(this, 'templateData');
        _.extend(data, optionalData);
        var markup = Backbone.View.template(this.template)(data);
        this.$el.html(markup);
      }
      this.setElement(this.el);
    
      this.trigger('render:after');
      return this;
    },
  
    templateData: function() {
      return this.model ? this.model.toJSON() : {};
    },
    
    trigger: function(name) {
      if (_.isObject(this.events)) {
        var handler = this.events[name];
        if (_.isString(handler)) { handler = this[handler]; }
        if (_.isFunction(handler)) { handler.apply(this, _.rest(arguments)); }
      }
      return Backbone.Events.trigger.apply(this, _.toArray(arguments));
    },
    
    append: function(view, el) {
      view.listenTo(this, 'close:before render:before', view.close);
      
      var $el;
      if (_.isUndefined(el)) $el = this.$el;
      else if (_.isString(el)) $el = this.$(el);
      else $el = el;
      
      $el.append(view.render().el);
      return this;
    }
  
  });
    
})(Backbone.View);