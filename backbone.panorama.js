_.extend(Backbone.View.prototype, {
  
  render: function() {
    this.trigger('render:before');
    this.trigger('render:after');
    return this;
  }
  
});