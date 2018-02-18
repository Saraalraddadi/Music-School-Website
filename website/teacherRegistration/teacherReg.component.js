(function(app) {
  app.TeacherRegistrationRouterComponent =
    ng.core.Component({
      selector: 'teacher-registration-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/teacherReg.component.ejs',
      styleUrls: ['../..'+localPath+'css/teacherReg.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Teacher Registration';
	      }
      ]
    });
})(window.app || (window.app = {}));