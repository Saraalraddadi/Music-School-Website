(function(app) {
  app.ViewAllInstrumentsComponent =
    ng.core.Component({
      selector: 'all-instruments' ,
      templateUrl: localPath+'views/viewAllInstruments.component.ejs',
      styleUrls: ['../../..'+localPath+'css/viewAllInstruments.component.css']
    })
    .Class({
      constructor: [
        app.ReturnInstrumentsService,
        ng.router.Router,
        app.UserService,
	      function(ReturnInstrumentsService, Router, UserService) {
          this.ReturnInstrumentsService = ReturnInstrumentsService;
          this.Router = Router;
          this.UserService = UserService;
          
          this.instruments = [];
          this.filteredInstruments = [];
          this.filterText = '';

          this.GetInstruments = function() {
            this.ReturnInstrumentsService.GetInstruments()
              .then(response => {
                if (response.valid) {
                  this.instruments = response.instruments;
                  this.filteredInstruments = this.instruments;
                  this.filterText = '';
                } else {
                  if(response.results) {
                    this.error = 'An error has occured. Please contact administration for further assitance.';
                  } else {
                    this.error = 'No instruments are currently borrowed.';
                  }
                }
              })
              .catch(err => {
                console.log(err);
                this.error = 'An error has occured. Please try again later';
            });
          }

          this.SelectInstrument = function(instrumentID) {
            var link = ['/individual', instrumentID];
            this.Router.navigate(link);
          }

          this.Filter = function() {
            this.filteredInstruments = [];
            filterString = new RegExp(this.filterText, "gi");
            for (var i = 0; i < this.instruments.length; i++) {
              var instrument = this.instruments[i];
              var name = instrument.firstname+" "+instrument.lastname;
              if (name.match(filterString)) {
                this.filteredInstruments.push(instrument);
              }
            }
          }

          this.PageIsAvailable = function() {
            if (this.UserService.GetCurrentUser().type == 'manager') {
              return true;
            } else {
              return false;
            }
          }

	      }
      ]
    });
    app.ViewAllInstrumentsComponent.prototype.ngOnInit = function() {
      this.GetInstruments();
    };
})(window.app || (window.app = {}));