(function(app) {
  app.GenerateReportsRouterComponent =
    ng.core.Component({
      selector: 'generate-reports-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/generateReports.component.ejs',
      styleUrls: ["../.."+localPath+'css/generateReports.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Generate Reports';
	      }
      ]
    });
})(window.app || (window.app = {}));