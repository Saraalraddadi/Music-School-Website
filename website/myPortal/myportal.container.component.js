(function(app) {
  app.MyPortalContainerComponent =
    ng.core.Component({
      selector: 'my-portal-container',
      templateUrl: localPath+'views/myportal.container.component.ejs',
      styleUrls: ['..'+localPath+'css/myportal.container.component.css']
    })
    .Class({
      constructor: [
	      app.MyPortalService,
        app.UserService,
        function(MyPortalService, UserService) {
          this.MyPortalService = MyPortalService;
	    	  this.UserService = UserService;
          this.title = "My.Portal";

          this.FormIsAvailable = function() {
            if(this.UserService.IsSomeoneLoggedIn()) {
              return true;
            }

            return false;
          }
        }
      ]
    });
    app.MyPortalContainerComponent.prototype.ngOnInit = function() {
      
    };
})(window.app || (window.app = {}));