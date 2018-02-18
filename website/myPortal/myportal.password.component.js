(function(app) {
  app.MyPortalPasswordComponent =
    ng.core.Component({
      selector: 'my-portal-password',
      templateUrl: localPath+'views/myportal.password.component.ejs',
      styleUrls: ['..'+localPath+'css/myportal.password.component.css']
    })
    .Class({
      constructor: [
	      app.MyPortalService,
        app.UserService,
        function(MyPortalService, UserService) {
          this.MyPortalService = MyPortalService;
          this.passwordForm;
        
          this.editing = false;

          this.enterEditingMode = function() {
            this.editing = true;
            this.success = false;
            this.passwordForm = new PasswordForm();
          }

          this.cancelEditing = function() {
            this.editing = false;
            this.error = false;
            this.success = false;
          }

          this.saveChanges = function() {
            if(this.passwordForm.passwordsMatch()) {
              this.MyPortalService.SavePasswordData(this.passwordForm.toPost())
              .then(response => {
                if (response.valid) {
                  this.editing = false;
                  this.success = "Password Successfully Changed!";
                } else {
                  this.error = response.error;
                  this.success = false;
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
            }  else {
              this.error = "Passwords do not match";
            }
            
          }
        }
      ]
    });
})(window.app || (window.app = {}));

function PasswordForm() {
  this.post = {
              old_password: '',
              new_password: '',
              new_password_conf: ''
            };

  this.passwordsMatch = function() {
    if(this.post.new_password == this.post.new_password_conf) {
      return true;
    }
    return false;
  };

  this.toPost = function() {
    return {
      id: 0,
      type: '',
      old: this.post.old_password,
      new: this.post.new_password
    }
  }

}