(function(app) {
  app.TeacherApplicationRouterComponent =
    ng.core.Component({
      selector: 'teacher-application-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/teacherApplication.component.ejs',
      styleUrls: ['../..'+localPath+'css/teacherApplication.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Teacher Application';
	      }
      ]
    });
})(window.app || (window.app = {}));