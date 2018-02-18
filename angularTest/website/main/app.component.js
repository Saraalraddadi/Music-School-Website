(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      template: `<h1>{{title}}</h1>
      			 <nav>
	      			 <a routerLink="/dashboard">Dashboard</a>
	      			 <a routerLink="/heroes">Heroes</a>
	      		 </nav>
      			 <router-outlet></router-outlet>`,
      styleUrls: ['main/app.component.css']
    })
    .Class({
      constructor: [
	      function() {
	    	this.title = 'Tour of Heroes';

	      }
      ]
    });
})(window.app || (window.app = {}));