(function(app) {
  app.NewInstrumentModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(newInstrumentRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.NewInstrumentRouterComponent
        , app.NewInstrumentFormComponent
        , app.NewInstrumentConfirmationComponent
      ],
      providers: [ app.NewInstrumentService, app.UserService, app.CookieService ],
      bootstrap: [ app.NewInstrumentRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
