(function(app) {
  app.ReturnInstrumentsRouterComponent =
    ng.core.Component({
      selector: 'return-instruments-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/returnInstruments.component.ejs',
      styleUrls: ["../../.."+localPath+'css/returnInstruments.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'View Instrument Hires';
	      }
      ]
    });
})(window.app || (window.app = {}));