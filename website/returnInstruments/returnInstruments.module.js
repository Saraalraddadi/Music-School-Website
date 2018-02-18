(function(app) {
  app.ReturnInstrumentsModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(returnInstrumentsRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.ReturnInstrumentsRouterComponent
        , app.ViewAllInstrumentsComponent
        , app.ViewIndividualInstrumentComponent
      ],
      providers: [ app.ReturnInstrumentsService, app.UserService, app.CookieService ],
      bootstrap: [ app.ReturnInstrumentsRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
