(function(app) {
  app.TeacherLoginAppModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ app.TeacherLoginComponent ],
      providers: [ app.LoginService, app.CookieService, app.UserService ],
      bootstrap: [ app.TeacherLoginComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));