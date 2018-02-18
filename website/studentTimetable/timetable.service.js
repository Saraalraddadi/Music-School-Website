(function(app) {
  app.TimetableService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        app.UserService,
        function(http, UserService) {
          this.http = http;
          this.UserService = UserService;
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.GetLessons = function() {
            var url = "/student/timetable/getLessons/?id="+UserService.GetCurrentUser().id;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var lessons = JSON.parse(response._body);
              return Promise.resolve(lessons);
            })
            .catch(this.handleError);
          }

          this.GetLesson = function(lessonId) {
            var url = "/student/timetable/getLesson/?studentId="+UserService.GetCurrentUser().id +"&lessonId=" + lessonId;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var lesson = JSON.parse(response._body);
              return Promise.resolve(lesson);
            })
            .catch(this.handleError);
          }

          this.CancelLesson = function(lessonId) {
            var body = {
              lessonId: lessonId,
              studentId: this.UserService.GetCurrentUser().id
            }

            var url = '/student/timetable/cancelLesson';
            return this.http.post(url, body, this.headers).toPromise()
            .then(response => {
              var response = JSON.parse(response._body);
              return Promise.resolve(response);
            })
            .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));