(function(app) {
  app.ApplyConfirmationComponent =
    ng.core.Component({
      selector: 'apply-confirmation' ,
      templateUrl: localPath+'views/applyConfirmation.component.ejs',
      styleUrls: ['../..'+localPath+'views/applyConfirmation.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  
	      }
      ]
    });
})(window.app || (window.app = {}));