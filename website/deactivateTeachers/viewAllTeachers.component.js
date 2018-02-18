(function(app) {
  app.ViewAllTeachersComponent =
    ng.core.Component({
      selector: 'all-teachers' ,
      templateUrl: localPath+'views/viewAllTeachers.component.ejs',
      styleUrls: ['../..'+localPath+'css/viewAllTeachers.component.css']
    })
    .Class({
      constructor: [
        app.DeactivateTeachersService,
        ng.router.Router,
        app.UserService,
	      function(DeactivateTeachersService, Router, UserService) {
          this.DeactivateTeachersService = DeactivateTeachersService;
          this.Router = Router;
          this.UserService = UserService;
          
          this.teachers = [];
          this.filteredTeachers = [];
          this.showingDeactivatedTeachers = false;

          this.GetTeachers = function() {
            this.DeactivateTeachersService.GetTeachers()
              .then(response => {
                if (!response.error) {
                  this.teachers = response.teachers;
                  this.filteredTeachers = this.teachers;
                  this.showingDeactivatedTeachers = false;
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later';
            });
          }

          this.GetDeactivatedTeachers = function() {
            this.DeactivateTeachersService.GetDeactivatedTeachers()
              .then(response => {
                if (!response.error) {
                  this.teachers = response.teachers;
                  this.filteredTeachers = this.teachers;
                  this.showingDeactivatedTeachers = true;
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later';
            });
          }

          this.SelectTeacher = function(teacherID) {
            var link = ['/individual', teacherID];
            this.Router.navigate(link);
          }

          this.Filter = function() {
            this.filteredTeachers = [];
            filterString = new RegExp(this.filterText, "gi");
            for (var i = 0; i < this.teachers.length; i++) {
              var teacher = this.teachers[i];
              var name = teacher.firstname+" "+teacher.lastname;
              if (name.match(filterString)) {
                this.filteredTeachers.push(teacher);
              }
            }
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
    app.ViewAllTeachersComponent.prototype.ngOnInit = function() {
      this.GetTeachers();
    };
})(window.app || (window.app = {}));