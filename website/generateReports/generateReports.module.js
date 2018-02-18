(function(app) {
  app.GenerateReportsModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.router.RouterModule.forRoot(generateReportsRouting)
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.GenerateReportsRouterComponent
        , app.ViewAllReportsComponent
        , app.InstrumentSummaryReportComponent
        , app.LessonSummaryReportComponent
      ],
      providers: [
          app.GenerateReportsService
        , app.CookieService
        , app.UserService
      ],
      bootstrap: [ app.GenerateReportsRouterComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
