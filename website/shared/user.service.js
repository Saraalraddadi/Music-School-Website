(function(app) {
  app.UserService =
  	ng.core.Class({
  		constructor: [
        app.CookieService,
        function(CookieService) {
          this.CookieService = CookieService;

          this.SetCurrentUser = function(id, displayName, email, type, validation) {
            this.CookieService.SetCookie('id', id);
            this.CookieService.SetCookie('displayName', displayName);
            this.CookieService.SetCookie('email', email);
            this.CookieService.SetCookie('type', type);
            this.CookieService.SetCookie('validation', validation);
          }

          this.GetCurrentUser = function() {
            var user = {
              id: this.CookieService.GetCookie('id'),
              displayName: this.CookieService.GetCookie('displayName'),
              email: this.CookieService.GetCookie('email'),
              type: this.CookieService.GetCookie('type'),
              validation: this.CookieService.GetCookie('validation')
            }
            return user;
          }

          this.SignOutUser = function() {
            this.CookieService.ClearCookie('id');
            this.CookieService.ClearCookie('displayName');
            this.CookieService.ClearCookie('email');
            this.CookieService.ClearCookie('type');
            this.CookieService.ClearCookie('validation');
          }

          this.IsSomeoneLoggedIn = function() {
            var user = this.GetCurrentUser();
            if(user.id != '')
              return true;
            return false;
          }

          this.checkUserType = function(userType) {
            var user = this.GetCurrentUser();
            if(user.type == userType){
              return true;
            }

            return false;
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));