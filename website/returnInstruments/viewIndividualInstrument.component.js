(function(app) {
  app.ViewIndividualInstrumentComponent =
    ng.core.Component({
      selector: 'individual-instrument' ,
      templateUrl: localPath+'views/viewIndividualInstrument.component.ejs',
      styleUrls: ["../../.."+localPath+'css/viewIndividualInstrument.component.css']
    })
    .Class({
      constructor: [
	      app.ReturnInstrumentsService,
        app.UserService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        function(ReturnInstrumentsService, UserService, Router, ActivatedRoute) {
          this.ReturnInstrumentsService = ReturnInstrumentsService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.UserService = UserService;
          this.error;
          this.hasValidId = false;
          this.instrument = {};

          this.GoBack = function() {
            window.history.back();
          }

          this.ReturnInstrument = function(hireID) {
            this.ReturnInstrumentsService.ReturnInstrument(hireID)
              .then(response => {
                if (response.status) {
                  var link = ['/all'];
                  this.Router.navigate(link);
                } else {
                  this.error = 'There was an error';
                }
              })
              .catch(err => {
              });
          }

          this.PageIsAvailable = function() {
            if (this.UserService.GetCurrentUser().type == 'manager' && this.hasValidId) {
              return true;
            } else {
              return false;
            }
          }

        }
      ]
    });
    app.ViewIndividualInstrumentComponent.prototype.ngOnInit = function() {

      var urlParams = this.ActivatedRoute.params._value;
      var hireID = +urlParams.id;

      if(hireID > 0) {
        this.ReturnInstrumentsService.GetInstrument(hireID)
        .then(response => {
          if (response.status) {
            this.instrument = response.instrument[0];
            this.hasValidId = true;
          } else {
            this.error = 'An error has occured. Invalid parameters have been passed: hireId=' + hireID;
          }
        }).catch(() => {
          this.error = 'An error has occured. Please try again later.';
        });
      } else {
        this.error = "Invalid ID."
      }
    };
})(window.app || (window.app = {}));