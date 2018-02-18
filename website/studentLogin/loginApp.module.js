(function(app) {
  app.StudentLoginAppModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ app.StudentLoginComponent ],
      providers: [ app.LoginService, app.CookieService, app.UserService ],
      bootstrap: [ app.StudentLoginComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));