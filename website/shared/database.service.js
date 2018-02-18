(function(app) {
  app.DatabaseService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;

          

    		}//End of constructor
  	]});
})(window.app || (window.app = {}));