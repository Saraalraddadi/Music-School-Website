(function(app) {
  app.LessonInformationComponent =
    ng.core.Component({
      selector: 'lesson-info-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/lessonInfo.component.ejs',
      styleUrls: ['../..'+localPath+'css/lessonInfo.component.css']
    })
    .Class({
      constructor: [
	      app.InstrumentService,
        function(InstrumentService) {
          this.InstrumentService = InstrumentService;
	    	  this.title = "Lesson Information";
          this.instruments = new Array();

          this.GetInstruments = function() {
            this.InstrumentService.GetInstruments()
            .then(response => {
              if (response.status) {
                this.instruments = response.instruments;
              } else {
                this.error = 'An error has occured. Please inform administrators.';
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later';
            });
          };
        }
      ]
    });
    app.LessonInformationComponent.prototype.ngOnInit = function() {
      this.GetInstruments();
    };
})(window.app || (window.app = {}));