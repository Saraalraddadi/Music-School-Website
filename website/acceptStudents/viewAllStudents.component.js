(function(app) {
  app.ViewAllStudentsComponent =
    ng.core.Component({
      selector: 'all-students' ,
      templateUrl: localPath+'views/viewAllStudents.component.ejs',
      styleUrls: ['../..'+localPath+'css/viewAllStudents.component.css']
    })
    .Class({
      constructor: [
        app.AcceptStudentsService,
        app.UserService,
        ng.router.Router,
	      function(AcceptStudentsService, UserService, Router) {
          this.AcceptStudentsService = AcceptStudentsService;
          this.UserService = UserService;
          this.Router = Router;
          
          this.students = [];

          this.SelectStudentRequest = function(requestID) {
            var link = ['/individual', requestID];
            this.Router.navigate(link);
          }

          this.FormIsAvailable = function() {
          if(this.UserService.GetCurrentUser().type == 'teacher') {
                return true;
            }
            
            return false;
          }

          this.GetStudents = function() {
            if(this.FormIsAvailable()) {
              this.AcceptStudentsService.GetStudents()
              .then(response => {
                if (!response.error) {
                  this.students = response.students;
                  for (var i = 0; i < this.students.length; i++) {
                    var dateOfBirth = this.students[i].dob.split('-');
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
                      this.students[i].dob = (yearDifference - 1);
                    } else {
                      this.students[i].dob = yearDifference;
                    }
                  }
                } else {
                  this.error = response.error;
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
            }
          }
	      }
      ]
    });
    app.ViewAllStudentsComponent.prototype.ngOnInit = function() {
      this.GetStudents();
    };
})(window.app || (window.app = {}));