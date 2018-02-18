(function(app) {
  app.InstrumentHireRequestsRouterComponent =
    ng.core.Component({
      selector: 'instrument-hire-requests-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/instrumentHireRequests.component.ejs',
      styleUrls: ["../../.."+localPath+'css/instrumentHireRequests.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'View Instrument Hire Requests';
	      }
      ]
    });
})(window.app || (window.app = {}));