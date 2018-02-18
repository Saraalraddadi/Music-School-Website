(function(app) {
  app.RegistrationService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.registerUrl = '/register/student';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AttemptRegistration = function(student) {
              return this.http.post(this.registerUrl, student, this.headers).toPromise()
              .then(response => {
                var valid = JSON.parse(response._body);
                return valid;
              })
              .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));