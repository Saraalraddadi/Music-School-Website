(function(app) {
  app.ManagerRegistrationModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(managerRegRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.ManagerRegistrationRouterComponent
        , app.RegisterFormComponent
        , app.RegisterConfirmationComponent
      ],
      providers: [ app.RegistrationService, app.UserService, app.CookieService ],
      bootstrap: [ app.ManagerRegistrationRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
