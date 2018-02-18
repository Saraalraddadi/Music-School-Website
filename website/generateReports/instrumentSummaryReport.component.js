(function(app) {
  app.InstrumentSummaryReportComponent =
    ng.core.Component({
      selector: 'instrument-summary-report' ,
      inputs: ['report'],
      templateUrl: localPath+'views/viewTableReport.component.ejs',
      styleUrls: ["../.."+localPath+'css/viewTableReport.component.css']
    })
    .Class({
      constructor: [
        app.GenerateReportsService,
    	  app.UserService,
        ng.router.Router,
        ng.router.ActivatedRoute,
        function(GenerateReportsService, UserService, Router, ActivatedRoute) {
          this.GenerateReportsService = GenerateReportsService;
          this.UserService = UserService;
          this.Router = Router;
          this.ActivatedRoute = ActivatedRoute;
          this.error;

          this.reportDisplayName = "Instrument Summary";
          this.reportName = "instrument-summary-report";
          this.report = false;
          this.reportRows = [
            {rowHeading: 'Number of Instrument Hires', dataKey: 'instrumenthires'}
            ,{rowHeading: 'Number of Instrument Hire Requests', dataKey: 'hirerequests'}
            ,{rowHeading: 'Number of Instrument Hire Requests Rejected', dataKey: 'rejectedrequests'}
            ,{rowHeading: 'Most Popular Instrument Hired', dataKey: 'mostpopular'}
            ,{rowHeading: 'Least Popular Instrument Hired', dataKey: 'leastpopular'}
            ,{rowHeading: 'Total Income from Instrument Hires (to date)', dataKey: 'totalincome'}
          ];

          this.GoBack = function() {
            window.history.back();
          }

          this.FormIsAvailable = function() {
            if(this.UserService.GetCurrentUser().type == 'manager') {
                return true;
            }
            return false;
          }
	      }
      ]
    });
    app.InstrumentSummaryReportComponent.prototype.ngOnInit = function() {

      this.GenerateReportsService.GetReport(this.reportName).then(response => {
        if (!response.error) {
          this.report = response.report[0];
        } else {
          this.error = 'An error has occured. Please contact administration for further assitance.';
        }
      }).catch(() => {
        this.error = 'An error has occured. Please try again later.';
      });
    };
})(window.app || (window.app = {}));