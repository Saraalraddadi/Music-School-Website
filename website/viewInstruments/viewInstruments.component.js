(function(app) {
  app.ViewInstrumentsRouterComponent =
    ng.core.Component({
      selector: 'view-instruments-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/viewInstruments.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewInstruments.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'View Instruments';
	      }
      ]
    });
})(window.app || (window.app = {}));