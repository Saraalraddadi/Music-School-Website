(function(app) {
  app.StudentTimetableComponent =
    ng.core.Component({
      selector: 'student-timetable' ,
      templateUrl: localPath+'views/mainTimetable.component.ejs',
      styleUrls: ['../..'+localPath+'css/mainTimetable.component.css']
    })
    .Class({
      constructor: [
        app.TimetableService,
        app.UserService,
        ng.router.Router,
	      function(TimetableService, UserService, Router) {
          this.TimetableService = TimetableService;
          this.UserService = UserService;
          this.Router = Router;
          this.dayLessons = [];
          for(var i = 0; i < 7; i++) {
            this.dayLessons[i] = [];
          }

          this.dayConversion = ["Sun","Mon","Tue","Wed","Thur","Fri","Sat"];

          this.FormIsAvailable = function() {
            if(this.UserService.GetCurrentUser().type == 'student') {
                return true;
            }
            
            return false;
          }

          this.GetLessons = function() {
            this.TimetableService.GetLessons()
            .then(response => {
              if (response.valid) {
                console.log(response.lessons);
                response.lessons.forEach((lsn) => {
                  var lsnDay = lsn.lesson_day;
                  this.dayLessons[lsnDay].push(lsn);
                });
                console.log(this.dayLessons);
              } else {
                this.error = response.error;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later';
            });
          };

          this.GotoLesson = function(id) {
            var link = ['/lesson', id];
            this.Router.navigate(link);
          }

          this.ConvertToDisplayTime = function(time) {
            var dms = time.split(":");

            if(dms[0] > 12) {
              var hours = dms[0] - 12;
              return hours + ":" + dms[1] + "pm";
            } else if(dms[0] == 12) {
              return dms[0] + ":" + dms[1] + "pm";
            } else {
              var hours = parseInt(dms[0]);
              return hours + ":" + dms[1] + "am";
            }
          }
	      }
      ]
    });
    app.StudentTimetableComponent.prototype.ngOnInit = function() {
      this.GetLessons();
    };
})(window.app || (window.app = {}));