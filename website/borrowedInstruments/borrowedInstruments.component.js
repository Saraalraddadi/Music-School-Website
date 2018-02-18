(function(app) {
  app.BorrowedInstrumentsComponent =
    ng.core.Component({
      selector: 'lesson-info-app',
      directives: [ng.router.ROUTER_DIRECTIVES],
      templateUrl: localPath+'views/borrowedInstruments.component.ejs',
      styleUrls: ['../../..'+localPath+'css/borrowedInstruments.component.css']
    })
    .Class({
      constructor: [
	      app.BorrowHistoryService,
        app.UserService,
        function(BorrowHistoryService, UserService) {
	    	  this.title = "Borrowed Instruments";
          this.BorrowHistoryService = BorrowHistoryService;
          this.UserService = UserService;

          this.instruments = [];
          this.hiredInstruments = [];
          this.requestedInstruments = [];
          this.rejectedInstruments = [];
          this.previousInstruments = [];
          this.error = false;

          this.GetInstruments = function() {
            this.BorrowHistoryService.GetInstruments()
              .then(response => {
                if (!response.error) {
                  this.instruments = response.instruments;
                  for (var i = 0; i < this.instruments.length; i++) {
                    var instrument = this.instruments[i];
                    if (instrument.returned) {
                      this.previousInstruments.push(instrument);
                    } else if (instrument.statusid == 1) {
                      this.requestedInstruments.push(instrument);
                    } else if (instrument.statusid == 2) {
                      this.hiredInstruments.push(instrument);
                    } else {
                      this.rejectedInstruments.push(instrument);
                    }
                  }
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
          }

          this.PageIsAvailable = function() {
            if (this.UserService.GetCurrentUser().type == 'student') {
              return true;
            } else {
              return false;
            }
          }

        }
      ]
    });
    app.BorrowedInstrumentsComponent.prototype.ngOnInit = function() {
      this.GetInstruments();
    };
})(window.app || (window.app = {}));