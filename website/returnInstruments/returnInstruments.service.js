(function(app) {
  app.ReturnInstrumentsService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.responseURL = '/management/instruments/individual/return/';
          this.requestURL = '/management/instruments/getInstruments/';
          this.individualRequestURL = '/management/instruments/getInstrument/'
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.ReturnInstrument = function(hireID) {
            var params = {
              requestID: hireID
            };
            return this.http.post(this.responseURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.GetInstruments = function() {
            return this.http.get(this.requestURL, this.headers).toPromise()
            .then(response => {
              var instruments = JSON.parse(response._body);
              return Promise.resolve(instruments);
            })
            .catch(this.handleError);
          }

          this.GetInstrument = function(instrumentID) {
            var url = this.individualRequestURL+"?id="+instrumentID;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var result = JSON.parse(response._body);
              return Promise.resolve(result);
            })
            .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));