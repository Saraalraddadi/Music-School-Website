(function(app) {
  app.ViewIndividualTeacherApplicationComponent =
    ng.core.Component({
      selector: 'individual-teacher-application' ,
      inputs: ['teacher-application'],
      templateUrl: localPath+'views/viewIndividualTeacherApplication.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewIndividualTeacherApplication.component.css']
    })
    .Class({
      constructor: [
    	  app.ViewTeacherApplicationsService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        app.UserService,
        function(ViewTeacherApplicationsService, Router, ActivatedRoute, UserService) {
          this.ViewTeacherApplicationsService = ViewTeacherApplicationsService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.UserService = UserService;
          this.error;
          this.teacherApplication = {};
          this.instruments = [];
          this.languages = [];
          this.references = [];

          this.GoBack = function() {
            window.history.back();
          }

          this.ShortlistTeacherApplication = function(teacherApplicationID, firstName, lastName, email) {
            var name = firstName + " " + lastName;
            this.ViewTeacherApplicationsService.ShortlistTeacherApplication(teacherApplicationID, name, email)
              .then(response => {
                if (response.status) {
                  var link = ['/all'];
                  this.Router.navigate(link);
                } else {
                  this.error = 'There was an error';
                }
              });
          }

          this.RejectTeacherApplication = function(teacherApplicationID, firstName, lastName, email) {
            var name = firstName + " " + lastName;
            this.ViewTeacherApplicationsService.RejectTeacherApplication(teacherApplicationID, name, email)
              .then(response => {
                if (response.status) {
                  var link = ['/all'];
                  this.Router.navigate(link);
                } else {
                  this.error = 'There was an error';
                }
              });
          }

          this.PageIsAvailable = function() {
            if (this.UserService.GetCurrentUser().type == 'manager') {
              return true;
            } else {
              return false;
            }
          }

	      }
      ]
    });
    app.ViewIndividualTeacherApplicationComponent.prototype.ngOnInit = function() {

      var urlParams = this.ActivatedRoute.params._value;
      var id = +urlParams.id;

      this.ViewTeacherApplicationsService.GetTeacherApplication(id).then(response => {
        if (!response.error) {
          this.teacherApplication = response.teacherApplication[0];
          this.instruments = response.instruments;
          this.references = response.references;
          this.languages = response.languages;

          var dateOfBirth = this.teacherApplication.dob.split('-');
          var d = new Date();
          var year = d.getFullYear();
          var yearDifference = year - dateOfBirth[0];
          var month = d.getMonth();
          var day = d.getDay();
          var preBirthday = false;
          if (month < dateOfBirth[1]) {
            preBirthday = true;
          } else if (month = dateOfBirth[1] && day < dateOfBirth[2]) {
            preBirthday = true;
          }
          if (preBirthday) {
            this.teacherApplication.dob = (yearDifference - 1);
          } else {
            this.teacherApplication.dob = yearDifference;
          }
          
          if (this.teacherApplication.status == 3) {
            this.teacherApplication.uiStatus = "Rejected";
          } else if (this.teacherApplication.shortlisted == true) {
            this.teacherApplication.uiStatus = "Shortlisted";
          } else {
            this.teacherApplication.uiStatus = "Applied";
          }

        } else {
          this.error = 'An error has occured. Please contact administration for further assitance.';
        }
      }).catch(() => {
        this.error = 'An error has occured. Please try again later.';
      });
    };
})(window.app || (window.app = {}));