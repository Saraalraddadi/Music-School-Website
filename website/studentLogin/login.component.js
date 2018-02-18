(function(app) {
  app.StudentLoginComponent =
    ng.core.Component({
      selector: 'student-login-app',
      templateUrl: localPath+'views/loginForm.ejs',
      styleUrls: ['../..'+localPath+'css/loginForm.css']
    })
    .Class({
      constructor: [
        app.LoginService,
        function(LoginService) {
          this.LoginService = LoginService;
          this.title = "Student Login";
          this.loggedIn = false;
          this.loggingIn = false;

          this.user = {
            email: '',
            password: ''
          };

          this.Login = function() {
            this.loggingIn = true;

            this.LoginService.AttemptLogin(this.user, 'student')
            .then(response => {
              if(response.valid != 'invalid') {
                this.LoginService.Login(response.user);
              } else {
                this.loggingIn = false;
                this.error = response.error;
              }
            })
            .catch(()=>{});
          }

          this.CheckLoggedIn = function() {
            if(this.LoginService.IsSomeoneLoggedIn()) {
              this.loggedIn = true;
            } else {
              this.loggedIn = false;
            }
          }

          this.Logout = function() {
            this.loggedIn = false;
          }
        }
      ]
    });

  app.StudentLoginComponent.prototype.ngOnInit = function() {
    this.CheckLoggedIn();
  };
})(window.app || (window.app = {}));