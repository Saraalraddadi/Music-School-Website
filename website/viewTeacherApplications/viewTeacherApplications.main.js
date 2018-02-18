(function(app) {
  document.addEventListener('DOMContentLoaded', function() {
    ng.platformBrowserDynamic
      .platformBrowserDynamic()
      .bootstrapModule(app.ViewTeacherApplicationsModule);
  });
})(window.app || (window.app = {}));