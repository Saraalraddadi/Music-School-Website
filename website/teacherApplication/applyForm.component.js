(function(app) {
  app.ApplyFormComponent =
    ng.core.Component({
      selector: 'apply-form' ,
      templateUrl: localPath+'views/applyForm.component.ejs',
      styleUrls: ['../..'+localPath+'css/applyForm.component.css']
    })
    .Class({
      constructor: [
        app.ApplicationService,
        app.UserService,
        ng.router.Router,
	      function(ApplicationService, UserService, Router) {
          this.ApplicationService = ApplicationService;
          this.UserService = UserService;
          this.Router = Router;
	        this.teacherApplication = new TeacherApplication();
          this.languagesList = [];
          this.submitted = false;
          this.isValid = {
            firstName:true,
            middleName:true,
            lastName:true,
            birthday:true,
            phoneNumber:true,
            gender:true,
            instruments:true,
            languages:true,
            coverLetter:true,
            reference1name:true,
            reference1number:true,
            reference2name:true,
            reference2number:true,
            reference3name:true,
            reference3number:true,
            hours:true,
            email:true,
            dbError:false,
            dbErrorMessage:''
          };

          this.Apply = function() {
            this.submitted = true;
            this.error = '';
            //Send to application Service
            //then redirect
            this.ApplicationService.AttemptApplication(this.teacherApplication)
              .then(response => {
                if (response.status) {
                  var link = ['/Confirmation'];
                  this.Router.navigate(link);
                } else {
                  if (response.errorArray.dbError) {
                    this.error = response.errorArray.dbErrorMessage;
                  } else {
                    this.isValid = response.errorArray;
                  }
                  this.submitted = false;
                }
              }).catch(error => {
                this.submitted = false;
                this.error = 'An error has occured. Please try again later.';
              });
          }

          this.GetDatabaseValues = function() {
            this.ApplicationService.GetDatabaseValues()
              .then(response => {
                if(response.valid) {
                  this.languagesList = response.languagesList;
                } else {
                  this.error = response.error;
                }
              })
              .catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
          }

	      }
      ]
    });
    app.ApplyFormComponent.prototype.ngOnInit = function() {
      this.GetDatabaseValues();
      $('.datepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '01/01/1900',
        maxDate: 0,
        yearRange: "1900:-0",
        monthRange: "Jan:Dec",
        showAnim: "fadeIn",
        onSelect: (date) => { this.teacherApplication.birthday = date; }
      }).attr('readonly', 'readonly');
    };
})(window.app || (window.app = {}));