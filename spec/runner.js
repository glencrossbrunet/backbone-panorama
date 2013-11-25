(function() {  
  window.onload = function() {
    var env = jasmine.getEnv();
    env.addReporter(new jasmine.HtmlReporter());
    env.execute();
  };
  
})();