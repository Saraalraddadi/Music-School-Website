(function(app) {
  app.InstrumentHireRequestsService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.acceptResponseURL = '/management/instrument/requests/respondToRequest/accept/';
          this.declineResponseURL = '/management/instrument/requests/respondToRequest/reject/';
          this.requestURL = '/management/instrument/getInstrumentHireRequests/';
          this.individualRequestURL = '/management/instrument/requests/getIndividualRequest/'
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AcceptInstrumentHireRequest = function(hireID) {
            var params = {
              hireID: hireID
            };
            return this.http.post(this.acceptResponseURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.RejectInstrumentHireRequest = function(hireID) {
            var params = {
              hireID: hireID
            };
            return this.http.post(this.declineResponseURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.GetInstrumentHireRequests = function() {
            return this.http.get(this.requestURL, this.headers).toPromise()
            .then(response => {
              var instrumentHireRequests = JSON.parse(response._body);
              return Promise.resolve(instrumentHireRequests);
            })
            .catch(this.handleError);
          }

          this.GetInstrument = function(hireId) {
            var url = this.individualRequestURL+"?id="+hireId;
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