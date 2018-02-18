(function(app) {
  app.BorrowedInstrumentsModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.BorrowedInstrumentsComponent
      ],
      providers: [ app.BorrowHistoryService, app.UserService, app.CookieService ],
      bootstrap: [ app.BorrowedInstrumentsComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
