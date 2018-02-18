(function(app) {
  app.LoginService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        app.UserService,
        function(http, UserService) {
          this.http = http;
          this.UserService = UserService;
          this.loginUrl = '/login/';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.AttemptLogin = function(user,userType) {
              var url = this.loginUrl + userType;
              return this.http.post(url, user, this.headers).toPromise()
              .then(response => {
                var userCookie = JSON.parse(response._body);
                return Promise.resolve(userCookie);
              })
              .catch(this.handleError);
          }

          this.Login = function(user) {
            this.UserService.SetCurrentUser(user.id, user.displayName, user.email, user.type, user.validation);
            location.href="/";
          }

          this.IsSomeoneLoggedIn = function() {
            return this.UserService.IsSomeoneLoggedIn();
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));