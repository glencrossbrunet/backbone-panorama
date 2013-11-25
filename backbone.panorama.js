_.extend(Backbone.View, {
  
  template: function(name) {
    if (_.isFunction(name)) return name;
    return window.JST[name];
  }
  
});

_.extend(Backbone.View.prototype, {
  
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
  
  close: function(ev) {
    if (ev && ev.preventDefault) ev.preventDefault();
    
    this.remove();    
    return this;
  }
  
});