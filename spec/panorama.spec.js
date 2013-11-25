describe('Backbone.View', function() {
  
  describe('::template', function() {
    beforeEach(function() {
      this.template = _.template('hello');
    });
    
    it('should use JST template by default', function() {
      window.JST['test'] = this.template;
      expect(Backbone.View.template('test')).toEqual(this.template);      
    });
    
    it('should pass functions through', function() {
      expect(Backbone.View.template(this.template)).toEqual(this.template);
    });
  });
  
  describe('#render', function() {
    beforeEach(function() {
      this.view = new Backbone.View;
    });
    
    it('should return the view', function() {
      expect(this.view.render()).toEqual(this.view);
    });
    
    describe('events', function() {
      var object = {};
            
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
        this.view.template = 'template';
      });
      
      it('should render', function() {
        var markup = '<div>test</div>';
        window.JST['template'] = _.template(markup);
        expect(this.view.render().$el.html()).toEqual(markup);        
      });
    });
    
    describe('templateData', function() {
      beforeEach(function() {
        this.view.template = 'template';
        window.JST['template'] = _.template('<%= name %>')
      });
      
      it('should allow raw object', function() {
        this.view.templateData = { name: 'AJ' };
        expect(this.view.render().$el.html()).toEqual('AJ');
      });
      
      it('should evaluate fn', function() {
        this.view.templateData = function() {
          return { name: 'AJ' };
        };
        expect(this.view.render().$el.html()).toEqual('AJ');
      });
      
      it('should default to model json', function() {
        this.view.model = new Backbone.Model({ name: 'AJ' });
        expect(this.view.render().$el.html()).toEqual('AJ');
      });
    });
    
    describe('optionalData', function() {
      beforeEach(function() {
        this.view.template = 'template';
        window.JST['template'] = _.template('<%= status %>');
        this.view.templateData = { status: 'incomplete' };
      });
      
      it('should take precedence', function() {
        var data = { status: 'complete' };
        expect(this.view.render(data).$el.html()).toEqual('complete');
      });
    });
  });

});