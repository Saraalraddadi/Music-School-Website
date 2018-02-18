(function(app) {
	//Exports our AppComponent to the app
	//AppComponent can be renamed
  app.HeroComponent =
    ng.core.Component({
      selector: 'heroes-app',
      templateUrl: 'main/app.ejs',
      styleUrls: ['main/heroStyling.css']
    })
    .Class({
      constructor: [
      	  app.HeroService,
          ng.router.Router,
	      function(HeroService, router) {
	    	this.HeroService = HeroService;
	    	this.router = router;

	    	this.GetHeroes = function() {
	    		this.HeroService.GetHeroes()
	    		.then(
		    		value => {
		    			if(!value) {
		    				this.heroes = [new Hero(1, "Unknown")];
		    			} else {
			    			this.heroes = value
			    		}
		    		}
		    		, reject => {
		    			this.heroes = [new Hero(1, "Unknown")];
		    			console.log(reject);
		    		}
		    	);
	    	}

	    	this.onSelect = function(hero) {
	    		this.selectedHero = hero;
	    	}

			this.Delete = function(id) {
				this.HeroService.DeleteHero(id).then(() => {
					this.GetHeroes();
				});
			}

	    	this.gotoDetail = function() {
	    	  var link = ['/detail', this.selectedHero.id];
              this.router.navigate(link);
	    	}

	    	this.ShowNewHeroEntry = function() {
	    		this.newHero = {name:''};
	    	}

	    	this.AddNewHero = function() {
	    		this.HeroService.CreateHero(this.newHero.name).then(() => {
	    			this.GetHeroes();
	    			this.newHero = null;
	    		});
	    	}
	      }
      ]
    });
  app.HeroComponent.prototype.ngOnInit = function() {
  	this.GetHeroes();
  };
})(window.app || (window.app = {}));