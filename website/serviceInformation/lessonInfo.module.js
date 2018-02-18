(function(app) {
  app.LessonInformationModule =
    ng.core.NgModule({
      imports: [ 
	      ng.platformBrowser.BrowserModule
      , ng.forms.FormsModule
      , ng.http.HttpModule
      ],
      declarations: [ 
          app.LessonInformationComponent
      ],
      providers: [ app.InstrumentService ],
      bootstrap: [ app.LessonInformationComponent ]
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
