(function(app) {
  app.MyPortalProfessionalComponent =
    ng.core.Component({
      selector: 'my-portal-professional',
      templateUrl: localPath+'views/myportal.professional.component.ejs',
      styleUrls: ['..'+localPath+'css/myportal.professional.component.css']
    })
    .Class({
      constructor: [
	      app.MyPortalService,
        app.UserService,
        function(MyPortalService, UserService) {
          this.MyPortalService = MyPortalService;
          this.skillsForm = new skillsForm();

          this.allLanguages = [];
          this.allInstruments = [];
        
          this.editing = false;
          this.loading = true;
          this.saving = false;

          this.enterEditingMode = function() {
            this.editing = true;
            this.skillsForm.save();
          }

          this.cancelEditing = function() {
            this.editing = false;
            this.skillsForm.revert();
          }

          this.saveChanges = function() {
            this.saving = true;
            this.MyPortalService.SaveProfessionalData(this.skillsForm.skills)
            .then(response => {
              this.saving = false;
              if (response.valid) {
                this.GetSkills();
                this.editing = false;
              } else {
                this.skillsForm.revert();
                this.editing = false;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }

          this.GetSkills = function() {
            this.MyPortalService.GetTeacherSkills()
            .then(response => {
              if (response.valid) {
                console.log(response);
                this.loading = false;
                this.skillsForm.skills.languages = response.languages;
                this.skillsForm.skills.instruments = response.instruments;
                this.skillsForm.skills.grades = response.grades;
                this.skillsForm.save();
                this.allLanguages = response.allLanguages;
                this.allInstruments = response.allInstruments;
              } else {
                this.error = response.error;
              }
            }).catch(() => {
              this.error = 'An error has occured. Please try again later.';
            });
          }

          this.instIdIsSelected = function(instId) {
            for(var i = 0; i < this.skillsForm.skills.instruments.length; i++) {
              if(instId==this.skillsForm.skills.instruments[i]) return true;
            }
            return false;
          }
          this.langIdIsSelected = function(langId) {
            for(var i = 0; i < this.skillsForm.skills.languages.length; i++) {
              if(langId==this.skillsForm.skills.languages[i]) return true;
            }
            return false;
          }
        }
      ]
    });
    app.MyPortalProfessionalComponent.prototype.ngOnInit = function() {
      this.GetSkills();
    };
})(window.app || (window.app = {}));

function skillsForm() {
  this.skills = {
              id: 0,
              languages: [],
              instruments: [],
              grades: []
            };

  this.backup = {
              id: 0,
              languages: [],
              instruments: [],
              grades: []
            };

  this.save = function() {
    for(var attr in this.skills) {
      try {
        for(var val in this.skills[attr]) {
          try {
            this.backup[attr][val] = this.skills[attr][val];
          } catch (e) {}
        }
      } catch (e) {}
    }
    this.revert();
  };

  this.revert = function() {
    for(var attr in this.backup) {
      try {
        for(var val in this.backup[attr]) {
          try {
            this.skills[attr][val] = this.backup[attr][val];
          } catch (e) {}
        }
      } catch (e) {}
    }
  }

}