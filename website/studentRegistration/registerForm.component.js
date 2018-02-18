(function(app) {
  app.RegisterFormComponent =
    ng.core.Component({
      selector: 'register-form' ,
      templateUrl: localPath+'views/registerForm.component.ejs',
      styleUrls: ['../..'+localPath+'css/registerForm.component.css']
    })
    .Class({
      constructor: [
        app.RegistrationService,
        ng.router.Router,
	      function(RegistrationService, Router) {
          this.RegistrationService = RegistrationService;
          this.Router = Router;
	    	  this.student = new Student();
          this.submitted = false;
          this.isValid = {
            firstName:true,
            middleName:true,
            lastName:true,
            birthday:true,
            address:true,
            phoneNumber:true,
            email:true,
            password:true,
            gender:true,
            errorMessage:''
          };

          this.Register = function() {
            this.submitted = true;
            this.error = '';
            //Send to registration Service
            //then redirect
            this.RegistrationService.AttemptRegistration(this.student)
              .then(response => {
                if (response.status) {
                  var link = ['/Confirmation'];
                  this.Router.navigate(link);

                } else {
                  this.isValid = response.errorArray;
                  this.submitted = false;
                  this.error = this.isValid.errorMessage;
                }
              }).catch(() => {
                this.submitted = false;
                this.error = 'An error has occured. Please try again later';
            });
          }
	      }
      ]
    });
    app.RegisterFormComponent.prototype.ngOnInit = function() {
      $('.datepicker')
      .datepicker({
          dateFormat: 'dd/mm/yy',
          changeMonth: true,
          changeYear: true,
          minDate: '01/01/1900',
          maxDate: 0,
          yearRange: "1900:-0",
          monthRange: "Jan:Dec",
          showAnim: "fadeIn",
          onSelect: (date) => { this.student.birthday = date; }
      }).attr('readonly', 'readonly');
    };
})(window.app || (window.app = {}));