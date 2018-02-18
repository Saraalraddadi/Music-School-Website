(function(app) {
  app.ViewAllReportsComponent =
    ng.core.Component({
      selector: 'all-reports' ,
      templateUrl: localPath+'views/viewAllReports.component.ejs',
      styleUrls: ['../..'+localPath+'css/viewAllReports.component.css']
    })
    .Class({
      constructor: [
        app.GenerateReportsService,
        app.UserService,
        ng.router.Router,
	      function(GenerateReportsService, UserService, Router) {
          this.GenerateReportsService = GenerateReportsService;
          this.UserService = UserService;
          this.Router = Router;
          
          this.reports = [];

          this.SelectReport = function(reportName) {
            var link = ['/individual', reportName];
            this.Router.navigate(link);
          }

          this.FormIsAvailable = function() {
          if(this.UserService.GetCurrentUser().type == 'manager') {
                return true;
            }
            
            return false;
          }

          this.GetReports = function() {
            if(this.FormIsAvailable()) {
              this.GenerateReportsService.GetReports()
              .then(response => {
                if (!response.error) {
                  this.reports = response.reports;
                } else {
                  this.error = response.error;
                }
              }).catch(() => {
                this.error = 'An error has occured. Please try again later.';
              });
            }
          }
	      }
      ]
    });
    app.ViewAllReportsComponent.prototype.ngOnInit = function() {
      this.GetReports();
    };
})(window.app || (window.app = {}));