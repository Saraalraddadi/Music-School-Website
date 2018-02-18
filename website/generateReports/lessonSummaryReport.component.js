(function(app) {
  app.LessonSummaryReportComponent =
    ng.core.Component({
      selector: 'lesson-summary-report' ,
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

          this.reportDisplayName = "Lesson Summary";
          this.reportName = "lesson-summary-report";
          this.report = false;
          this.reportRows = [
            {rowHeading: 'Number of Lessons Booked', dataKey: 'booked'}
            ,{rowHeading: 'Number of Lessons Cancelled', dataKey: 'cancelled'}
            ,{rowHeading: 'Number of Lessons Rejected (specific teacher requested)', dataKey: 'specificrejected'}
            ,{rowHeading: 'Number of Lessons Rejected (rejected by all available teachers)', dataKey: 'allrejected'}
            ,{rowHeading: 'Most Popular Instrument Lesson', dataKey: 'popularinstrument'}
            ,{rowHeading: 'Most Popular Day for Lessons', dataKey: 'popularday'}
            ,{rowHeading: 'Average Days Between Request & Accept', dataKey: 'averagedays'}
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
    app.LessonSummaryReportComponent.prototype.ngOnInit = function() {
      console.log(this.reportName);
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