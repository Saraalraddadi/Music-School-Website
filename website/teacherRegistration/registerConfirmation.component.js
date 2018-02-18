(function(app) {
  app.RegisterConfirmationComponent =
    ng.core.Component({
      selector: 'register-confirmation' ,
      templateUrl: localPath+'views/registerConfirmation.component.ejs',
      styleUrls: ['../..'+localPath+'views/registerConfirmation.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  
	      }
      ]
    });
})(window.app || (window.app = {}));