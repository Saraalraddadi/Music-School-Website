(function(app) {
  app.StudentRegistrationRouterComponent =
    ng.core.Component({
      selector: 'student-registration-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/stdntReg.component.ejs',
      styleUrls: [localPath+'views/stdntReg.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Student Registration';
	      }
      ]
    });
})(window.app || (window.app = {}));