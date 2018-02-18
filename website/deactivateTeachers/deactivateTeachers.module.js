(function(app) {
  app.DeactivateTeachersModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(deactivateTeachersRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.DeactivateTeachersRouterComponent
        , app.ViewAllTeachersComponent
        , app.ViewIndividualTeacherComponent
      ],
      providers: [ app.DeactivateTeachersService, app.UserService, app.CookieService ],
      bootstrap: [ app.DeactivateTeachersRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
