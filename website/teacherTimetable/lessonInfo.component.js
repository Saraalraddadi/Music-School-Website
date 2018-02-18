(function(app) {
  app.LessonInfoComponent =
    ng.core.Component({
      selector: 'teacher-individual-lesson' ,
      templateUrl: localPath+'views/lessonInfo.component.ejs',
      styleUrls: ['../..'+localPath+'css/lessonInfo.component.css']
    })
    .Class({
      constructor: [
        app.TimetableService,
        app.UserService,
        ng.router.Router,
        ng.router.ActivatedRoute,
	      function(TimetableService, UserService, Router, ActivatedRoute) {
          this.TimetableService = TimetableService;
          this.UserService = UserService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.inAction = false;
          this.error = '';
          this.lessonId = 0;

          this.lesson = false;

          this.dayConversion = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


          this.FormIsAvailable = function() {
          if(this.UserService.GetCurrentUser().type == 'teacher') {
                return true;
            }
            
            return false;
          }

          this.GetLesson = function() {
            if(this.FormIsAvailable()) {
              this.TimetableService.GetLesson(this.lessonId)
              .then(response => {
                if (!response.error) {
                  this.lesson = response.lesson;
                } else {
                  this.error = response.error;
                }
              })
              .catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
            }
          }

          this.ConvertToDisplayTime = function(time) {
            if(!time) return;

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

          this.CancelLesson = function() {
            if(!confirm("Are you sure you want to delete this lesson?")) {
              return;
            }

            this.inAction = true;
            this.TimetableService.CancelLesson(this.lessonId)
            .then(response => {
              this.inAction = false;
              if(response.error) {
                this.error = response.error;
              } else {
                this.GoBack();
              }
            })
            .catch(() => {
              this.error = 'Unable to cancel the lesson at this time.';
            });
          }

          this.GoBack = function() {
            window.history.back();
          }

	      }
      ]
    });
    app.LessonInfoComponent.prototype.ngOnInit = function() {
      var urlParams = this.ActivatedRoute.params._value;
      var id = +urlParams.id;

      this.lessonId = id;

      this.GetLesson();
    };
})(window.app || (window.app = {}));