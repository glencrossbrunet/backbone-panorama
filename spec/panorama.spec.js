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
    
    it('should return itself', function() {
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
      
      it('should rebind click handlers', function() {
        var object = {};
        this.view.events = {
          'click #button': function() { object.clicked = true; }
        };
        this.view.template = _.template('<div id="button">Click me!</div>');
        this.view.render().$('#button').click();
        expect(object.clicked).toBe(true);
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
  
  describe('#close', function() {
    beforeEach(function() {
      this.view = new Backbone.View;
      this.model = new Backbone.Model;
    });
    
    it('should return itself', function() {
      expect(this.view.close()).toEqual(this.view);
    });
    
    it('should prevent default event', function() {
      var object = {};
      var ev = { 
        preventDefault: function() { object.prevented = true; } 
      };
      this.view.close(ev);
      expect(object.prevented).toBe(true);
    });
    
    it('should remove DOM node', function() {
      $('body').append(this.view.render().el);
      this.view.close();
      expect(this.view.$el.parent().length).toEqual(0);
    });
    
    it('should stop listening to everything', function() {
      var object = {};
      this.view.listenTo(this.model, 'change', function() {
        object.triggered = true;
      });
      this.view.close();
      this.model.set('key', 'value');
      expect(object.triggered).toBe(undefined);
    });
    
    it('should not turn into a zombie view', function() {
      this.view.model = this.model;
      var object = {};
      this.view.handler = function() { object.triggered = true; };
      this.model.on('change', this.view.handler, this.view);
      this.view.close();
      this.model.set({ key: 'value' });
      expect(object.triggered).toBe(undefined);
    });
    
    it('should trigger close:before', function() {
      var object = {};
      this.view.on('close:before', function() {
        object.before = true;
      });
      this.view.close();
      expect(object.before).toBe(true);
    });
    
    it('should trigger close:after', function() {
      var object = {};
      this.view.on('close:after', function() {
        object.after = true;
      });
      this.view.close();
      expect(object.after).toBe(true);
    });
    
    it('should trigger close:after when DOM element is gone', function() {
      var object = {}, view = this.view;
      
      runs(function() {
        view.remove = function() {
          this.$el.delay(50).fadeOut('slow');
        }
        view.on('close:after', function() { object.after = true; });
        this.view.close();
        expect(object.after).toBe(undefined);
      });
      waits(50);
      runs(function() {
        expect(object.after).toBe(true);
      });
    });
    
    it('should remove events', function() {
      var object = {};
      this.view.on('custom', function() { object.triggered = true; });
      this.view.close().trigger('custom');
      expect(object.triggered).toBe(undefined);
    });
  });
  
  describe('#trigger', function() {
    it('should allow declared events', function() {
      var object = {};
      this.view = new Backbone.View({
        events: {
          'custom': 'custom'
        }
      });
      this.view.custom = function() {
        object.custom = true;
      };
      this.view.trigger('custom');
      expect(object.custom).toBe(true);
    });
  });

});