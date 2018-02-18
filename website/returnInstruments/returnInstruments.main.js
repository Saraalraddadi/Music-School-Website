(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic
      .platformBrowserDynamic()
      .bootstrapModule(app.ReturnInstrumentsModule);
  });
})(window.app || (window.app = {}));