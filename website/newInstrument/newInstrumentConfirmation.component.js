(function(app) {
  app.NewInstrumentConfirmationComponent =
    ng.core.Component({
      selector: 'new-instrument-confirmation' ,
      templateUrl: localPath+'views/newInstrumentConfirmation.component.ejs',
      styleUrls: ['../..'+localPath+'css/newInstrumentConfirmation.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  
	      }
      ]
    });
})(window.app || (window.app = {}));