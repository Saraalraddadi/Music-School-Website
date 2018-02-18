(function(app) {
  app.LoggedInModule =
    ng.core.NgModule({
      imports: [ 
        ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.LoggedInComponent
      ],
      providers: [ app.CookieService, app.UserService ],
      bootstrap: [ app.LoggedInComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
