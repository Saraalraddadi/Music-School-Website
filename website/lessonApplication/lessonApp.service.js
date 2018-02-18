(function(app) {
  app.LessonApplicationService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.CheckAvailability = function(availabilityCheck) {
              var url = '/database/checkAvailability/';
              return this.http.post(url, availabilityCheck, this.headers).toPromise()
              .then(response => {
                return response;
              })
              .catch(this.handleError);
          }

          this.AttemptLessonBooking = function(lesson) {
              var url = '/lessons/application/';
              return this.http.post(url, lesson, this.headers).toPromise()
              .then(response => {
                var res = JSON.parse(response._body);
                return Promise.resolve(res);
              })
              .catch(this.handleError);
          }

          this.StudentCanRegister = function(req) {
              var url = '/lessons/application/checkStudent';
              return this.http.post(url, req, this.headers).toPromise()
              .then(response => {
                var res = JSON.parse(response._body);
                return Promise.resolve(res);
              })
              .catch(this.handleError);
          }

          this.GetDatabaseValues = function() {
              var url = '/lessons/application/getDatabaseValues';
              return this.http.get(url, this.headers).toPromise()
              .then(response => {
                var res = JSON.parse(response._body);
                return Promise.resolve(res);
              })
              .catch(this.handleError);
          }

          this.GetInstruments = function(id) {
              if(id) {
                var url = '/database/getInstruments?id=' + id;
                return this.http.get(url, this.headers).toPromise()
                .then(response => {
                  var res = JSON.parse(response._body);
                  return Promise.resolve(res);
                })
                .catch(this.handleError);
              }
          }

          this.getTeachers = function(instrumentType, language) {
              if(instrumentType && language) {
                var url = '/database/getTeachers?instId=' + instrumentType + '&langId=' + language;
                return this.http.get(url, this.headers).toPromise()
                .then(response => {
                  var res = JSON.parse(response._body);
                  return Promise.resolve(res);
                })
                .catch(this.handleError);
              }
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]})
})(window.app || (window.app = {}));