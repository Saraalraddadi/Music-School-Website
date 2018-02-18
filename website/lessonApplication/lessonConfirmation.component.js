(function(app) {
  app.LessonConfirmationComponent =
    ng.core.Component({
      selector: 'lesson-confirmation' ,
      templateUrl: localPath+'views/lessonConfirmation.component.ejs',
      styleUrls: ['../..'+localPath+'views/lessonConfirmation.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  
	      }
      ]
    });
})(window.app || (window.app = {}));