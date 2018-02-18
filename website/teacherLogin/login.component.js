(function(app) {
  app.TeacherLoginComponent =
    ng.core.Component({
      selector: 'teacher-login-app',
      templateUrl: localPath+'views/loginForm.ejs',
      styleUrls: ['../..'+localPath+'css/loginForm.css']
    })
    .Class({
      constructor: [
        app.LoginService,
        function(LoginService) {
          this.LoginService = LoginService;
          this.title = "Teacher Login";
          this.loggedIn = false;
          this.loggingIn = false;

          this.user = {
            email: '',
            password: ''
          };

          this.Login = function() {
            this.loggingIn = true;

            this.LoginService.AttemptLogin(this.user, 'teacher')
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

  app.TeacherLoginComponent.prototype.ngOnInit = function() {
    this.CheckLoggedIn();
  };
})(window.app || (window.app = {}));