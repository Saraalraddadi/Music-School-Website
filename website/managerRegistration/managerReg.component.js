(function(app) {
  app.ManagerRegistrationRouterComponent =
    ng.core.Component({
      selector: 'manager-registration-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/managerReg.component.ejs',
      styleUrls: ['../..'+localPath+'css/managerReg.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Manager Registration';
	      }
      ]
    });
})(window.app || (window.app = {}));