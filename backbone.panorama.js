_.extend(Backbone.View, {
  
  template: function(name) {
    return JST[name];
  }
  
});

_.extend(Backbone.View.prototype, {
  
  render: function() {
    this.trigger('render:before');
    this.trigger('render:after');
    return this;
  }
  
});