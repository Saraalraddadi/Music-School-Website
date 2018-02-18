(function(app) {
	//Exports our AppComponent to the app
	//AppComponent can be renamed
  app.HeroService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        function(http) {
          this.http = http;
          this.heroesUrl = '/myData';
          this.headers = new Headers({'Content-Type': 'application/json'});

    			this.GetHeroes = function() {
            /*return new Promise(resolve => {
              resolve(HEROES);
            });*/
            return this.http.get(this.heroesUrl).toPromise()
                   .then(response => {
                      var heroes = JSON.parse(response._body);
                      return heroes;
                   })
                      .catch(this.handleError);
    			}

          this.handleError = function(error) {
            console.error('An error has occured: ', error);
            return Promise.reject(error.message || error);
          }

          this.GetHero = function(id) {
            if(!id) return;

            return new Promise(resolve => {
              this.GetHeroes().then(response => {
                resolve(response.find(hero => {
                  return hero.id === id;
                }));
              })
            });
          }//End of GetHero

          this.CreateHero = function(name) {
            var postBody = {"name":name};
            return this.http.post('/CreateHero', postBody, this.headers).toPromise()
              .then(response => {
                //Post successful
              })
              .catch(this.handleError);
          }

          this.UpdateHero = function(hero) {
            var url = this.heroesUrl + '/' + hero.id;
            return this.http.put(url, hero, this.headers).toPromise()
              .then(() => hero)
              .catch(this.handleError);;
          }

          this.DeleteHero = function(id) {
            var url = this.heroesUrl + '/' + id;
            return this.http.delete(url,this.headers).toPromise()
              .then(() => id)
              .catch(this.handleError);;
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));

function test (hero) {
  return hero.id === id;
}