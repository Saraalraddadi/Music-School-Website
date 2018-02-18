(function(app) {
  app.ViewAllInstrumentHireRequestsComponent =
    ng.core.Component({
      selector: 'all-instrument-hire-requests' ,
      templateUrl: localPath+'views/viewAllInstrumentHireRequests.component.ejs',
      styleUrls: ['../../..'+localPath+'css/viewAllInstrumentHireRequests.component.css']
    })
    .Class({
      constructor: [
        app.InstrumentHireRequestsService,
        ng.router.Router,
        app.UserService,
	      function(InstrumentHireRequestsService, Router, UserService) {
          this.InstrumentHireRequestsService = InstrumentHireRequestsService;
          this.Router = Router;
          this.UserService = UserService;
          
          this.instrumentHireRequests = [];
          this.filteredInstrumentRequests = [];
          this.filterText = '';

          this.GetInstrumentHireRequests = function() {
            this.InstrumentHireRequestsService.GetInstrumentHireRequests()
              .then(response => {
                if (response.status) {
                  this.instrumentHireRequests = response.instrumentHireRequests;
                  this.filteredInstrumentRequests = this.instrumentHireRequests;
                  this.filterText = '';
                } else {
                  if (!response.results) {
                    this.error = 'There are no current Hire Requests.';
                  } else {
                    this.error = 'An error has occured. Please contact administration for further assistance.';
                  }
                }
              }).catch(err => {
                this.error = 'An error has occured. Please try again later.';
            });
          }

          this.SelectInstrumentHireRequest = function(requestID) {
            var link = ['/individual/', requestID];
            this.Router.navigate(link);
          }

          this.Filter = function() {
            this.filteredInstrumentRequests = [];
            filterString = new RegExp(this.filterText, "gi");
            for (var i = 0; i < this.instrumentHireRequests.length; i++) {
              var hireRequest = this.instrumentHireRequests[i];
              var name = hireRequest.firstname+" "+hireRequest.lastname;
              if (name.match(filterString)) {
                this.filteredInstrumentRequests.push(hireRequest);
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
    app.ViewAllInstrumentHireRequestsComponent.prototype.ngOnInit = function() {
      this.GetInstrumentHireRequests();
    };
})(window.app || (window.app = {}));