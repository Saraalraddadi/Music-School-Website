(function(app) {
  app.BorrowHistoryService =
  	ng.core.Class({
  		constructor: [
        ng.http.Http,
        app.UserService,
        function(http, UserService) {
          this.http = http;
          this.UserService = UserService;
          this.headers = new Headers({'Content-Type': 'application/json'});
          this.requestUrl = '/student/instruments/borrowed/getInstrumentList/';

          this.GetInstruments = function() {
            var studentID = UserService.GetCurrentUser().id;
            var url = this.requestUrl+"?id="+studentID;
            return this.http.get(url, this.headers).toPromise()
            .then(response => {
              var instruments = JSON.parse(response._body);
              return instruments;
            })
            .catch(this.handleError);
          }

          this.handleError = function(error) {
            return Promise.reject(error.message || error);
          }
    		}//End of constructor
  	]});
})(window.app || (window.app = {}));