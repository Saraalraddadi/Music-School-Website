(function(app) {
  app.ViewTeacherApplicationsModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(viewTeacherApplicationsRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.ViewTeacherApplicationsRouterComponent
        , app.ViewAllTeacherApplicationsComponent
        , app.ViewIndividualTeacherApplicationComponent
      ],
      providers: [
          app.ViewTeacherApplicationsService
        , app.CookieService
        , app.UserService
      ],
      bootstrap: [ app.ViewTeacherApplicationsRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
