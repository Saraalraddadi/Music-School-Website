(function(app) {
  app.InstrumentService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.registerUrl = '/information/getInstruments';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.GetInstruments = function() {
              return this.http.get(this.registerUrl, this.headers).toPromise()
              .then(response => {
                var instruments = JSON.parse(response._body);
                return Promise.resolve(instruments);
              })
              .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));