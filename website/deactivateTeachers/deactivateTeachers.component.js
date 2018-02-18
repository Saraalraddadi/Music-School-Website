(function(app) {
  app.DeactivateTeachersRouterComponent =
    ng.core.Component({
      selector: 'deactivate-teachers-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/deactivateTeachers.component.ejs',
      styleUrls: ["../.."+localPath+'css/deactivateTeachers.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	  this.title = 'View Teacher Accounts';
	      }
      ]
    });
})(window.app || (window.app = {}));