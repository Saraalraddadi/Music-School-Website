(function(app) {
  app.ViewIndividualInstrumentComponent =
    ng.core.Component({
      selector: 'individual-instrument' ,
      templateUrl: localPath+'views/viewIndividualInstrument.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewIndividualInstrument.component.css']
    })
    .Class({
      constructor: [
	      app.ViewInstrumentsService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        app.UserService,
        function(ViewInstrumentsService, Router, ActivatedRoute, UserService) {
          this.ViewInstrumentsService = ViewInstrumentsService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.UserService = UserService;
          this.error;
          this.instrumentForm = new InstrumentForm();
          this.editing = false;
          this.error = false;

          this.GoBack = function() {
            window.history.back();
          }

          // add editing stuff

          this.DeleteInstrument = function() {
            if(confirm("Are you sure you want to delete this instrument?")) {
              this.ViewInstrumentsService.DeleteInstrument(this.instrumentId)
                .then(response => {
                  if (response.status) {
                    var link = ['/all'];
                    this.Router.navigate(link);
                  } else {
                    this.error = 'There was an error';
                  }
                });
            }
          }

          this.EnterEditMode = function() {
            this.editing = true;
            this.error = false;
          }

          this.CancelEditing = function() {
            this.editing = false;
            this.instrumentForm.revert();
            this.error = false;
          }

          this.SaveChanges = function() {
            this.ViewInstrumentsService.SaveInstrument(this.instrumentForm.toPost())
            .then(response => {
              console.log(response);
              if (response.valid) {
                this.instrumentForm.save();
                this.editing = false;
              } else {
                this.instrumentForm.revert();
                this.error = response.error;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }

          this.FormIsAvailable = function() {
            if(this.UserService.checkUserType('manager')) {
              return true;
            }
            
            return false;
          }

          this.GetInstrument = function() {
            this.ViewInstrumentsService.GetInstrument(this.instrumentId)
            .then(response => {
              if (!response.error) {
                this.instrumentForm.instrument = response.instrument[0];
                this.instrumentForm.save();
              } else {
                this.error = 'An error has occured. Please contact administration for further assitance.';
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }

        }
      ]
    });
    app.ViewIndividualInstrumentComponent.prototype.ngOnInit = function() {

      var urlParams = this.ActivatedRoute.params._value;
      this.instrumentId = +urlParams.id;

      this.ViewInstrumentsService.GetConditionList()
      .then(response => {
        if (!response.error) {
          this.conditions = response.conditions;
        } else {
          this.error = 'An error has occured. Please contact administration for further assitance.';
        }
      });

      this.GetInstrument();
    };
})(window.app || (window.app = {}));

function InstrumentForm() {
  this.instrument = {
              id: 0,
              model: '',
              purchase_date: '',
              purchase_price: '',
              condition_id: '',
              hire_fee: '',
              serial_no: '',
              inst_notes: ''
            };

  this.backup = {};

  this.save = function() {
    for(var attr in this.instrument) {
      try {
        this.backup[attr] = this.instrument[attr];
      } catch (e) {}
    }
  };

  this.revert = function() {
    for(var attr in this.backup) {
      try {
        this.instrument[attr] = this.backup[attr];
      } catch (e) {}
    }
  }

  this.toPost = function() {
    return {
      id: this.instrument.id,
      model: this.instrument.model,
      purchase_date: this.instrument.purchase_date,
      purchase_price: this.instrument.purchase_price,
      condition_id: this.instrument.condition_id,
      hire_fee: this.instrument.hire_fee,
      serial_no: this.instrument.serial_no,
      inst_notes: this.instrument.inst_notes,
    }
  }

}