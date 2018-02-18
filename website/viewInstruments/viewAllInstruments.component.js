(function(app) {
  app.ViewAllInstrumentsComponent =
    ng.core.Component({
      selector: 'all-instruments' ,
      templateUrl: localPath+'views/viewAllInstruments.component.ejs',
      styleUrls: ['../..'+localPath+'css/viewAllInstruments.component.css']
    })
    .Class({
      constructor: [
        app.ViewInstrumentsService,
        ng.router.Router,
        app.UserService,
	      function(ViewInstrumentsService, Router, UserService) {
          this.ViewInstrumentsService = ViewInstrumentsService;
          this.Router = Router;
          this.UserService = UserService;
          
          this.instruments = [];
          this.filteredInstruments = [];

          this.GetInstruments = function() {
            this.ViewInstrumentsService.GetInstruments()
              .then(response => {
                if (!response.error) {
                  this.instruments = response.instruments;
                  this.filteredInstruments = this.instruments;
                } else {
                  this.error = 'An error has occured. Please contact administration for further assitance.';
                }
              }).catch(() => {
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
              if (instrument.name.match(filterString)) {
                this.filteredInstruments.push(instrument);
              }
            }
          }

          this.Filter = function() {
            this.filteredInstruments = [];
            var filterTextArray = this.filterText.split(',');
            for (var i = 0; i < this.instruments.length; i++) {
              var instrument = this.instruments[i];
              var model = instrument.model;
              var condition = instrument.condition;
              var instrumentType = instrument.insttype;
              var hireFee = instrument.hirefee;
              var matchedCounter = 0;
              for (var j = 0; j < filterTextArray.length; j++) {
                filterString = new RegExp(filterTextArray[j].trim(), "gi");
                if (model.match(filterString) || condition.match(filterString) || instrumentType.match(filterString) || hireFee.match(filterString)) {
                  matchedCounter++;
                }
              }
              if (matchedCounter == filterTextArray.length) {
                this.filteredInstruments.push(instrument);
              }
            }
          }

          this.FormIsAvailable = function() {
            if(this.UserService.checkUserType('manager')) {
              return true;
            }
            
            return false;
          }

	      }
      ]
    });
    app.ViewAllInstrumentsComponent.prototype.ngOnInit = function() {
      this.GetInstruments();
    };
})(window.app || (window.app = {}));