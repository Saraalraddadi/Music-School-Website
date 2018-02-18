(function(app) {
  app.ViewAllTeacherApplicationsComponent =
    ng.core.Component({
      selector: 'all-teacher-applications' ,
      templateUrl: localPath+'views/viewAllTeacherApplications.component.ejs',
      styleUrls: ['../..'+localPath+'css/viewAllTeacherApplications.component.css']
    })
    .Class({
      constructor: [
        app.ViewTeacherApplicationsService,
        ng.router.Router,
        app.UserService,
	      function(ViewTeacherApplicationsService, Router, UserService) {
          this.ViewTeacherApplicationsService = ViewTeacherApplicationsService;
          this.Router = Router;
          this.UserService = UserService;
          
          this.teacherApplications = [];
          this.showingDeletedApplicants = false;
          this.showingShortlistedApplicants = false;

          this.SelectTeacherApplication = function(teacherApplicationID) {
            var link = ['/individual', teacherApplicationID];
            this.Router.navigate(link);
          }

          this.GetTeacherApplications = function() {
            this.ViewTeacherApplicationsService.GetTeacherApplications()
              .then(response => {
                console.log(response);
                if (!response.error) {
                  this.teacherApplications = response.teacherApplications;
                  this.filteredTeacherApplications = this.teacherApplications;
                  for (var i = 0; i < this.teacherApplications.length; i++) {
                    var dateOfBirth = this.teacherApplications[i].dob.split('-');
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
                      this.teacherApplications[i].dob = (yearDifference - 1);
                    } else {
                      this.teacherApplications[i].dob = yearDifference;
                    }
                    this.teacherApplications[i].dateapplied = this.teacherApplications[i].dateapplied.split("T")[0];
                    this.teacherApplications[i].class = '';

                    if (this.teacherApplications[i].status == 3) {
                      this.teacherApplications[i].class = 'rejected';
                    } else if (this.teacherApplications[i].shortlisted == true) {
                      this.teacherApplications[i].class = 'shortlisted';
                    } else {
                      this.teacherApplications[i].class = 'applied';
                    }

                    console.log(this.teacherApplications[i]);

                  }
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(err => {
                console.log(err);
                this.error = 'An error has occured. Please try again later.';
              });
          }

          this.ShowDeletedApplicants = function() {
            this.ViewTeacherApplicationsService.GetAllTeacherApplications()
              .then(response => {
                console.log(response);
                if (!response.error) {
                  this.teacherApplications = response.teacherApplications;
                  this.filteredTeacherApplications = this.teacherApplications;
                  for (var i = 0; i < this.teacherApplications.length; i++) {
                    var dateOfBirth = this.teacherApplications[i].dob.split('-');
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
                      this.teacherApplications[i].dob = (yearDifference - 1);
                    } else {
                      this.teacherApplications[i].dob = yearDifference;
                    }
                    this.teacherApplications[i].dateapplied = this.teacherApplications[i].dateapplied.split("T")[0];
                  }
                  this.showingDeletedApplicants = true;
                  this.showingShortlistedApplicants = false;
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(err => {
                console.log(err);
                this.error = 'An error has occured. Please try again later.';
              });
          }

          this.ShowShortlistedApplicants = function() {
            this.ViewTeacherApplicationsService.GetShortlistedTeacherApplications()
              .then(response => {
                console.log(response);
                if (!response.error) {
                  this.teacherApplications = response.teacherApplications;
                  this.filteredTeacherApplications = this.teacherApplications;
                  for (var i = 0; i < this.teacherApplications.length; i++) {
                    var dateOfBirth = this.teacherApplications[i].dob.split('-');
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
                      this.teacherApplications[i].dob = (yearDifference - 1);
                    } else {
                      this.teacherApplications[i].dob = yearDifference;
                    }
                    this.teacherApplications[i].dateapplied = this.teacherApplications[i].dateapplied.split("T")[0];
                  }
                  this.showingShortlistedApplicants = true;
                  this.showingDeletedApplicants = false;
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(err => {
                console.log(err);
                this.error = 'An error has occured. Please try again later.';
              });
          }

          this.HideDeletedApplicants = function() {
            this.GetTeacherApplications();
            this.showingDeletedApplicants = false;
            this.showingShortlistedApplicants = false;
          }

          this.HideShortlistedApplicants = function() {
            this.GetTeacherApplications();
            this.showingDeletedApplicants = false;
            this.showingShortlistedApplicants = false;
          }

          this.Filter = function() {
            this.filteredTeacherApplications = [];
            var filterTextArray = this.filterText.split(',');
            for (var i = 0; i < this.teacherApplications.length; i++) {
              var teacherApplication = this.teacherApplications[i];
              var name = teacherApplication.firstname+" "+teacherApplication.lastname;
              var instruments = teacherApplication.instruments;
              var languages = teacherApplication.languages;
              var matchedCounter = 0;
              for (var j = 0; j < filterTextArray.length; j++) {
                filterString = new RegExp(filterTextArray[j].trim(), "gi");
                if (name.match(filterString) || instruments.match(filterString) || languages.match(filterString)) {
                  matchedCounter++;
                }
              }
              if (matchedCounter == filterTextArray.length) {
                this.filteredTeacherApplications.push(teacherApplication);
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
    app.ViewAllTeacherApplicationsComponent.prototype.ngOnInit = function() {
      this.GetTeacherApplications();
    };
})(window.app || (window.app = {}));