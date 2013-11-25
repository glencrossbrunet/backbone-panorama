_.extend(Backbone.View, {
  
  template: function(name) {
    return window.JST[name];
  }
  
});

_.extend(Backbone.View.prototype, {
  
  render: function() {
    this.trigger('render:before');
    
    if (this.template) {
      var markup = Backbone.View.template(this.template)({});
      this.$el.html(markup);
    }
    
    this.trigger('render:after');
    return this;
  }
  
});