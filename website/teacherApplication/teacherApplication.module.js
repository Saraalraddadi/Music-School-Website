(function(app) {
  app.TeacherApplicationModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(teacherApplicationRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.TeacherApplicationRouterComponent
        , app.ApplyFormComponent
        , app.ApplyConfirmationComponent
      ],
      providers: [ app.ApplicationService, app.UserService, app.CookieService ],
      bootstrap: [ app.TeacherApplicationRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
