(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic
      .platformBrowserDynamic()
      .bootstrapModule(app.InstrumentHireRequestsModule);
  });
})(window.app || (window.app = {}));