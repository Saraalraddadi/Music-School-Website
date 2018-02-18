(function(app) {
  app.ViewInstrumentsModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(viewInstrumentsRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.ViewInstrumentsRouterComponent
        , app.ViewAllInstrumentsComponent
        , app.ViewIndividualInstrumentComponent
      ],
      providers: [ app.ViewInstrumentsService, app.UserService, app.CookieService ],
      bootstrap: [ app.ViewInstrumentsRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
