describe('Backbone.View', function() {
  
  describe('::template', function() {
    it('should use JST template by default', function() {
      var template = _.template('hello');
      window.JST['test'] = template;
      expect(Backbone.View.template('test')).toEqual(template);      
    });
  });
  
  describe('#render', function() {
    it('should return the view', function() {
      var view = new Backbone.View;
      expect(view.render()).toEqual(view);
    });
    
    describe('events', function() {
      var object = {};
      
      beforeEach(function() {
        this.view = new Backbone.View;
      });
            
      it('should trigger render:before', function() {
        this.view.on('render:before', function() {
          object.before = true;
        });
        this.view.render();
        expect(object.before).toBe(true);
      });
      
      it('should trigger render:after', function() {
        this.view.on('render:after', function() {
          object.after = true;
        });
        this.view.render();
        expect(object.after).toBe(true);
      });
    });
    
    describe('template', function() {
      beforeEach(function() {
        this.view = new Backbone.View;
        this.view.template = 'template';
      });
      
      it('should render', function() {
        var markup = '<div>test</div>';
        window.JST['template'] = _.template(markup);
        expect(this.view.render().el.innerHTML).toEqual(markup);        
      });
    });
  });

});