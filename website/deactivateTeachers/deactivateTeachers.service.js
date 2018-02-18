(function(app) {
  app.DeactivateTeachersService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.deactivateURL = '/management/teachers/individual/deactivate/';
          this.reactivateURL = '/management/teachers/individual/reactivate/';
          this.individualRequestURL = '/management/teachers/getIndividualTeacher/';
          this.requestAllURL = '/management/teachers/getAllTeachers/';
          this.requestDeactivatedURL = '/management/teachers/getAllTeachers/deactivated/';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.DeactivateTeacher = function(teacherID) {
            var params = {
              id: teacherID
            };
            return this.http.post(this.deactivateURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.ReactivateTeacher = function(teacherID) {
            var params = {
              id: teacherID
            };
            return this.http.post(this.reactivateURL, params, this.headers).toPromise()
            .then(response => {
              var valid = JSON.parse(response._body);
              return Promise.resolve(valid);
            })
            .catch(this.handleError);
          }

          this.GetTeachers = function() {
            return this.http.get(this.requestAllURL, this.headers).toPromise()
            .then(response => {
              var teachers = JSON.parse(response._body);
              return Promise.resolve(teachers);
            })
            .catch(this.handleError);
          }

          this.GetDeactivatedTeachers = function() {
            return this.http.get(this.requestDeactivatedURL, this.headers).toPromise()
            .then(response => {
              var teachers = JSON.parse(response._body);
              return Promise.resolve(teachers);
            })
            .catch(this.handleError);
          }

          this.GetTeacher = function(teacherID) {
            var url = this.individualRequestURL+"?id="+teacherID;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var teacher = JSON.parse(response._body);
              return Promise.resolve(teacher);
            })
            .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));