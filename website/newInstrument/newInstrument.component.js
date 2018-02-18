(function(app) {
  app.NewInstrumentRouterComponent =
    ng.core.Component({
      selector: 'new-instrument-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/newInstrument.component.ejs',
      styleUrls: ['../..'+localPath+'css/newInstrument.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Add New Instrument';
	      }
      ]
    });
})(window.app || (window.app = {}));