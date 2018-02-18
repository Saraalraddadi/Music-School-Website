(function(app) {
  app.StudentTimetableModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(studentTTRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.StudentTimetableRouterComponent
        , app.StudentTimetableComponent
        , app.LessonInfoComponent
      ],
      providers: [ app.TimetableService, app.UserService, app.CookieService ],
      bootstrap: [ app.StudentTimetableRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
