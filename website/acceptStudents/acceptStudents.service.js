(function(app) {
  app.AcceptStudentsService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        app.UserService,
        function(http, UserService) {
          this.http = http;
          this.UserService = UserService;
          this.acceptResponseURL = '/teacher/studentApplications/individual/accept/';
          this.rejectResponseURL = '/teacher/studentApplications/individual/reject/';
          this.requestURL = '/teacher/studentApplications/getStudents/';
          this.individualRequestURL = '/teacher/studentApplications/getStudent/';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AcceptStudent = function(requestID) {
            var params = {
              request: requestID,
              teacher: UserService.GetCurrentUser().id
            };
            return this.http.post(this.acceptResponseURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.RejectStudent = function(requestID) {
            var params = {
              request: requestID,
              teacher: UserService.GetCurrentUser().id
            };
            return this.http.post(this.rejectResponseURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.GetStudents = function() {
            var url = this.requestURL+"?id="+UserService.GetCurrentUser().id;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var students = JSON.parse(response._body);
              return Promise.resolve(students);
            })
            .catch(this.handleError);
          }

          this.GetStudent = function(requestID) {
            var url = this.individualRequestURL+"?id="+requestID;
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