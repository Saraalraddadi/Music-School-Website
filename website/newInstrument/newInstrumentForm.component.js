(function(app) {
  app.NewInstrumentFormComponent =
    ng.core.Component({
      selector: 'new-instrument-form' ,
      templateUrl: localPath+'views/newInstrumentForm.component.ejs',
      styleUrls: ['../../..'+localPath+'css/newInstrumentForm.component.css']
    })
    .Class({
      constructor: [
        app.NewInstrumentService,
        app.UserService,
        ng.router.Router,
	      function(NewInstrumentService, UserService, Router) {
          this.NewInstrumentService = NewInstrumentService;
          this.UserService = UserService;
          this.Router = Router;
	    	  this.instrument = new Instrument();
          this.submitted = false;
          this.isValid = {
            type:true,
            newInstType:true,
            condition:true,
            serialNumber:true,
            model:true,
            purchasePrice:true,
            hireFee:true,
            purchaseDate:true,
            description:true,
            errorMessage:''
          };

          this.typeList = [];
          this.conditionList = [];

          this.Add = function() {
            this.submitted = true;
            this.error = '';

            this.NewInstrumentService.AttemptAdd(this.instrument)
              .then(response => {
                if (response.status) {
                  var link = ['/Confirmation'];
                  this.Router.navigate(link);
                } else {
                  this.isValid = response.errorArray;
                  this.submitted = false;
                  this.error = this.isValid.errorMessage;
                }
              }).catch(err => {
                this.submitted = false;
                this.error = 'An error has occured. Please try again later';
            });
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
    app.NewInstrumentFormComponent.prototype.ngOnInit = function() {
      this.NewInstrumentService.GetTypeList()
      .then(response => {
        if(response.valid) {
          this.typeList = response.instrumentTypes;
        } else {
          this.error = "Unable to connect to the database. Please try again later."
        }
      })
      .catch(err => {
        this.error = "Unable to connect to the database. Please try again later."
      });

      this.NewInstrumentService.GetConditionList()
      .then(response => {
        if(response.valid) {
          this.conditionList = response.conditions;
        } else {
          this.error = "Unable to connect to the database. Please try again later."
        }
      })
      .catch(err => {
        this.error = "Unable to connect to the database. Please try again later."
      });
    };
    app.NewInstrumentFormComponent.prototype.ngAfterViewInit = function() {
      $('.datepicker').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        minDate: '01/01/1900',
        maxDate: 0,
        yearRange: "1900:-0",
        monthRange: "Jan:Dec",
        showAnim: "fadeIn",
        onSelect: (date) => { this.instrument.purchaseDate = date; }
      }).attr('readonly', 'readonly');
    };
})(window.app || (window.app = {}));