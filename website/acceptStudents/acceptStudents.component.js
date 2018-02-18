(function(app) {
  app.AcceptStudentsRouterComponent =
    ng.core.Component({
      selector: 'accept-students-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/acceptStudents.component.ejs',
      styleUrls: ["../.."+localPath+'css/acceptStudents.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'Accept Student Applications';
	      }
      ]
    });
})(window.app || (window.app = {}));