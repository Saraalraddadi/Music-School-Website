(function(app) {
  app.ManagerLoginAppModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ app.ManagerLoginComponent ],
      providers: [ app.LoginService, app.CookieService, app.UserService ],
      bootstrap: [ app.ManagerLoginComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));