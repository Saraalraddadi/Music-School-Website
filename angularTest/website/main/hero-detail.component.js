(function(app) {
	//Exports our AppComponent to the app
	//AppComponent can be renamed
  app.HeroDetailComponent =
    ng.core.Component({
      selector: 'my-hero-detail',
      inputs: ['hero'],
      templateUrl: 'main/hero-detail.component.ejs',
      styleUrls: ['main/hero-detail.component.css']
    })
    .Class({

      constructor: [
        app.HeroService,
        ng.router.ActivatedRoute,
        function(HeroService, ActivatedRoute) {
          this.HeroService = HeroService;
          this.ActivatedRoute = ActivatedRoute;
          this.hero = {};

          this.GoBack = function() {
            window.history.back();
          };

          this.Update = function() {
            this.HeroService.UpdateHero(this.hero).then(() => {
              this.GoBack();
            });
          }
        }
      ]
    });
    app.HeroDetailComponent.prototype.ngOnInit = function() {
      /*var id = this.routeParams.get('id');
      console.log(id);
      //this.heroService.getHero(id).then(hero => this.hero = hero);
      */
      var urlParams = this.ActivatedRoute.params._value;
      var id = +urlParams.id;

      this.HeroService.GetHero(id).then(hero => {this.hero = hero;});
    };
})(window.app || (window.app = {}));