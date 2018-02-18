(function(app) {
  app.ViewIndividualTeacherComponent =
    ng.core.Component({
      selector: 'individual-teacher' ,
      templateUrl: localPath+'views/viewIndividualTeacher.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewIndividualTeacher.component.css']
    })
    .Class({
      constructor: [
	      app.DeactivateTeachersService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        app.UserService,
        function(DeactivateTeachersService, Router, ActivatedRoute, UserService) {
          this.DeactivateTeachersService = DeactivateTeachersService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.UserService = UserService;
          this.error;
          this.teacher = false;

          this.GoBack = function() {
            window.history.back();
          }

          this.DeactivateTeacher = function(teacherID) {
            this.DeactivateTeachersService.DeactivateTeacher(teacherID)
              .then(response => {
                if (response.status) {
                  var link = ['/all'];
                  this.Router.navigate(link);
                } else {
                  this.error = 'There was an error';
                }
              })
              .catch(err => {
                console.log(err);
              });
          }

          this.ReactivateTeacher = function(teacherID) {
            this.DeactivateTeachersService.ReactivateTeacher(teacherID)
              .then(response => {
                if (response.status) {
                  var link = ['/all'];
                  this.Router.navigate(link);
                } else {
                  this.error = 'There was an error';
                }
              })
              .catch(err => {
                console.log(err);
              });
          }

          this.FormIsAvailable = function() {
            if(this.UserService.checkUserType('manager')) {
              return true;
            }
            
            return false;
          }

        }
      ]
    });
    app.ViewIndividualTeacherComponent.prototype.ngOnInit = function() {

      var urlParams = this.ActivatedRoute.params._value;
      var id = +urlParams.id;

      this.DeactivateTeachersService.GetTeacher(id).then(response => {
        if (!response.error) {
          this.teacher = response.teacher[0];
        } else {
          this.error = 'An error has occured. Please contact administration for further assitance.';
        }
      }).catch(() => {
        this.error = 'An error has occured. Please try again later.';
      });
    };
})(window.app || (window.app = {}));