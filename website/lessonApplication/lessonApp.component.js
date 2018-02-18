(function(app) {
  app.LessonApplicationRouterComponent =
    ng.core.Component({
      selector: 'lesson-registration-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/lessonApp.component.ejs',
      styleUrls: ['../..'+localPath+'css/lessonApp.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Lesson Application';
	      }
      ]
    });
})(window.app || (window.app = {}));