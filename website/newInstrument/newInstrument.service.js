(function(app) {
  app.NewInstrumentService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.addUrl = '/management/instrument/new';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AttemptAdd = function(instrument) {
              return this.http.post(this.addUrl, instrument, this.headers).toPromise()
              .then(response => {
                var valid = JSON.parse(response._body);
                return Promise.resolve(valid);
              })
              .catch(this.handleError);
          }

          this.GetTypeList = function() {
              var url = '/database/getInstrumentTypes';
              return this.http.get(url, this.headers).toPromise()
              .then(response => {
                var res = JSON.parse(response._body);
                return Promise.resolve(res);
              })
              .catch(this.handleError);
          }

          this.GetConditionList = function() {
              var url = '/database/getConditions';
              return this.http.get(url, this.headers).toPromise()
              .then(response => {
                var res = JSON.parse(response._body);
                return Promise.resolve(res);
              })
              .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));