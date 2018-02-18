(function(app) {
  app.ViewIndividualInstrumentHireRequestComponent =
    ng.core.Component({
      selector: 'individual-instrument-hire-request' ,
      templateUrl: localPath+'views/viewIndividualInstrumentHireRequest.component.ejs',
      styleUrls: ["../../.."+localPath+'css/viewIndividualInstrumentHireRequest.component.css']
    })
    .Class({
      constructor: [
	      app.InstrumentHireRequestsService,
        app.UserService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        function(InstrumentHireRequestsService, UserService, Router, ActivatedRoute) {
          this.InstrumentHireRequestsService = InstrumentHireRequestsService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.UserService = UserService;
          this.error = false;
          this.instrument = {};
          this.idSpecified = false;

          this.GoBack = function() {
            window.history.back();
          }

          this.AcceptInstrumentHireRequest = function(hireId) {
            this.InstrumentHireRequestsService.AcceptInstrumentHireRequest(hireId)
            .then(res => {
              if(res.status) {
                this.GoBack();
              } else {
                this.error = res.error;
              }
            })
          }

          this.RejectInstrumentHireRequest = function(hireId) {
            this.InstrumentHireRequestsService.RejectInstrumentHireRequest(hireId)
            .then(res => {
              if(res.status) {
                this.GoBack();
              } else {
                this.error = res.error;
              }
            })
          }

          this.PageIsAvailable = function() {
            if (this.UserService.GetCurrentUser().type == 'manager' && this.idSpecified) {
              return true;
            } else {
              return false;
            }
          }

        }
      ]
    });
    app.ViewIndividualInstrumentHireRequestComponent.prototype.ngOnInit = function() {
      var urlParams = this.ActivatedRoute.params._value;
      var id = +urlParams.id;

      if(id > 0) {
        this.InstrumentHireRequestsService.GetInstrument(id).then(response => {
          if (!response.error) {
            this.idSpecified = true;
            this.instrument = response.instrumentHireRequest[0];
          } else {
            this.error = 'An error has occured. Please contact administration for further assitance.';
          }
        }).catch(() => {
          this.error = 'An error has occured. Please try again later.';
        });
      }
    };
})(window.app || (window.app = {}));