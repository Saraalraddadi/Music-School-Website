(function(app) {
  app.ViewTeacherApplicationsRouterComponent =
    ng.core.Component({
      selector: 'view-teacher-applications-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/viewTeacherApplications.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewTeacherApplications.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'View Teacher Applications';
	      }
      ]
    });
})(window.app || (window.app = {}));