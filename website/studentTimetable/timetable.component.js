(function(app) {
  app.StudentTimetableRouterComponent =
    ng.core.Component({
      selector: 'student-timetable-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/timetable.component.ejs',
      styleUrls: ['../..'+localPath+'css/timetable.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Your Timetable';
	      }
      ]
    });
})(window.app || (window.app = {}));