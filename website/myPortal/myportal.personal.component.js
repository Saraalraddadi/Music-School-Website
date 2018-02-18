(function(app) {
  app.MyPortalPersonalComponent =
    ng.core.Component({
      selector: 'my-portal-personal',
      templateUrl: localPath+'views/myportal.personal.component.ejs',
      styleUrls: ['..'+localPath+'css/myportal.personal.component.css']
    })
    .Class({
      constructor: [
	      app.MyPortalService,
        app.UserService,
        function(MyPortalService, UserService) {
          this.MyPortalService = MyPortalService;
          this.userForm = new UserForm();
        
          this.editing = false;

          this.enterEditingMode = function() {
            this.editing = true;
            this.userForm.save();
          }

          this.cancelEditing = function() {
            this.editing = false;
            this.userForm.revert();
          }

          this.saveChanges = function() {
            this.MyPortalService.SavePersonalData(this.userForm.user)
            .then(response => {
              if (response.valid) {
                this.userForm.save();
                this.editing = false;
              } else {
                this.userForm.revert();
                this.editing = false;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }

          this.GetUser = function() {
            this.MyPortalService.GetUserDetails()
            .then(response => {
              if (!response.error) {
                this.userForm.user = response.user;
                this.userForm.user.dob = this.userForm.user.dob.split('T')[0];
                this.userForm.save();
              } else {
                this.error = response.error;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }
        }
      ]
    });
    app.MyPortalPersonalComponent.prototype.ngOnInit = function() {
      this.GetUser();
    };
})(window.app || (window.app = {}));

function UserForm() {
  this.user = {
              id: 0,
              type: '',
              first_name: '',
              middle_name: '',
              last_name: '',
              dob: '',
              address: '',
              phone_no: '',
              email: '',
              gender: ''
            };

  this.backup = {};

  this.save = function() {
    for(var attr in this.user) {
      try {
        this.backup[attr] = this.user[attr];
      } catch (e) {}
    }
  };

  this.revert = function() {
    for(var attr in this.backup) {
      try {
        this.user[attr] = this.backup[attr];
      } catch (e) {}
    }
  }

}