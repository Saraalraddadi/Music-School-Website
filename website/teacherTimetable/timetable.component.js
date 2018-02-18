(function(app) {
  app.TeacherTimetableRouterComponent =
    ng.core.Component({
      selector: 'teacher-timetable-app',
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