(function(View) {
  
  _.extend(View, {
  
    template: function(name) {
      if (_.isFunction(name)) return name;
      return window.JST[name];
    }
  
  });
  
  function maybeOff(object, key) {
    if (_.isFunction(object.off) && '$el' !== key) object.off(null, null, this);
  }
  
  _.extend(View.prototype, {
  
    close: function(ev) {
      if (ev && _.isFunction(ev.preventDefault)) ev.preventDefault();
      this.trigger('close:before');
      
      this.stopListening();
      _.each(this, maybeOff, this);
      
      if (this.rm) this.rm();
      else this.remove();
      var self = this;
      $(this.$el).promise().done(function() {
        self.trigger('close:after');
        self.off();
      });
      
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
    }
  
  });
    
})(Backbone.View);