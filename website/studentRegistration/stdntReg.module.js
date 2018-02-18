(function(app) {
  app.StudentRegistrationModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(stdntRegRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.StudentRegistrationRouterComponent
        , app.RegisterFormComponent
        , app.RegisterConfirmationComponent
      ],
      providers: [ app.RegistrationService ],
      bootstrap: [ app.StudentRegistrationRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
