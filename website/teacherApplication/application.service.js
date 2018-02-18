(function(app) {
  app.ApplicationService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.applyUrl = '/apply/teacher';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AttemptApplication = function(teacherApplication) {
              return this.http.post(this.applyUrl, teacherApplication, this.headers).toPromise()
              .then(response => {
                var valid = JSON.parse(response._body);
                return Promise.resolve(valid);
              })
              .catch(this.handleError);
          }

          this.GetDatabaseValues = function() {
              var url = '/database/getLanguages';
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