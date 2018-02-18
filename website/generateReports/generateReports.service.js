(function(app) {
  app.GenerateReportsService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        app.UserService,
        function(http, UserService) {
          this.http = http;
          this.UserService = UserService;
          this.getReportsURL = '/management/generateReports/getReports/';
          this.getIndividualReportURL = '/management/generateReports/getIndividualReport/';
          this.headers = new Headers({'Content-Type': 'application/json'});

          this.GetReports = function() {
            return this.http.get(this.getReportsURL, this.headers).toPromise()
            .then(response => {
              var report = JSON.parse(response._body);
              return Promise.resolve(report);
            })
            .catch(this.handleError);
          }

          this.GetReport = function(reportName) {
            var url = this.getIndividualReportURL+"?name="+reportName;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var result = JSON.parse(response._body);
              return Promise.resolve(result);
            })
            .catch(this.handleError);
          }

          this.handleError = function(error) {
            console.log(error);
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));