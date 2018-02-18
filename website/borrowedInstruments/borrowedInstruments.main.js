(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic
      .platformBrowserDynamic()
      .bootstrapModule(app.BorrowedInstrumentsModule);
  });
})(window.app || (window.app = {}));