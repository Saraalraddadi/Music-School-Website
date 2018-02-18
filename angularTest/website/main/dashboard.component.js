(function(app) {
  app.DashboardComponent =
    ng.core.Component({
      selector: 'my-dashboard',
      templateUrl: 'main/dashboard.component.ejs',
      styleUrls: ['main/dashboard.component.css']
    })
    .Class({
      constructor: [
        app.HeroService,
        ng.router.Router,
	      function(HeroService, router) {
          this.HeroService = HeroService;
          this.router = router;
          this.gotoDetail = function(hero) {
              var link = ['/detail', hero.id];
              this.router.navigate(link);
          }
	      }
      ]
    });
  app.DashboardComponent.prototype.ngOnInit = function() {
    this.HeroService.GetHeroes().then(response => {
      this.heroes = response.slice(1,5);
    });
  };
})(window.app || (window.app = {}));