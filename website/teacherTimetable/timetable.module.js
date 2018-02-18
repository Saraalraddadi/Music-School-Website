(function(app) {
  app.TeacherTimetableModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(teacherTTRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.TeacherTimetableRouterComponent
        , app.TeacherTimetableComponent
        , app.LessonInfoComponent
      ],
      providers: [ app.TimetableService, app.UserService, app.CookieService ],
      bootstrap: [ app.TeacherTimetableRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
