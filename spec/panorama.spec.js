describe('Backbone.View', function() {
  
  describe('#render', function() {
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
  });

});