(function() {
  window.JST = {};
  
  $(function() {
    var env = jasmine.getEnv();
    env.addReporter(new jasmine.HtmlReporter());
    env.execute();
  });
})();