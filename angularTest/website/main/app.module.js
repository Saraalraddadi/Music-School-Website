(function(app) {
  app.AppModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
	      , ng.forms.FormsModule
        //, ng.router.RouterModule
        , ng.router.RouterModule.forRoot(appRoutes)
        , ng.http.HttpModule
      ],
      declarations: [ 
          app.AppComponent
        , app.HeroComponent
        , app.HeroDetailComponent
        , app.DashboardComponent
      ],
      providers: [app.HeroService ],
      bootstrap: [ app.AppComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));