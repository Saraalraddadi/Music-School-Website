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
        app.UserService,
        ng.router.Router,
	      function(RegistrationService, UserService, Router) {
          this.RegistrationService = RegistrationService;
          this.UserService = UserService;
          this.Router = Router;
	        this.manager = new Manager();
          this.submitted = false;
          this.isValid = {
            firstName:true,
            middleName:true,
            lastName:true,
            gender:true,
            birthday:true,
            address:true,
            phoneNumber:true,
            email:true,
            dbError:false,
            dbErrorMessage:''
          };

          this.Register = function() {
            this.submitted = true;
            this.error = '';
            //Send to registration Service
            //then redirect
            this.RegistrationService.AttemptRegistration(this.manager)
              .then(response => {
                if (response.valid) {
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
                this.error = 'An error has occured. Please try again later';
            });
          }

          this.FormIsAvailable = function() {
            if(this.UserService.GetCurrentUser().type == 'manager') {
                return true;
            }
            
            return false;
          }
	      }
      ]
    });
    app.RegisterFormComponent.prototype.ngAfterViewInit = function() {
      $('.datepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '01/01/1900',
        maxDate: 0,
        yearRange: "1900:-0",
        monthRange: "Jan:Dec",
        showAnim: "fadeIn",
        onSelect: (date) => { this.manager.birthday = date; }
      }).attr('readonly', 'readonly');
    };
})(window.app || (window.app = {}));