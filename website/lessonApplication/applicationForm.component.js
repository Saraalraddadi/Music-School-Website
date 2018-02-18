(function(app) {
  app.ApplicationFormComponent =
    ng.core.Component({
      selector: 'register-form' ,
      templateUrl: localPath+'views/applicationForm.component.ejs',
      styleUrls: ['../..'+localPath+'css/applicationForm.component.css'],
    })
    .Class({
      constructor: [
        app.LessonApplicationService,
        ng.router.Router,
        app.UserService,
	      function(LessonApplicationService, Router, UserService) {
          this.LessonApplicationService = LessonApplicationService;
          this.Router = Router;
          this.UserService = UserService;
          this.lesson = new Lesson();

          this.initialPermissionCheck = true;
          this.studentIdValidated = false;
          this.formUnavailableReason = 'This form is loading...';
          this.submitted = false;
          this.givenStartTime = '';
          this.isValid = {
            instrumentType: true,
            grade:          true,
            hireType:       true,
            instrumentId:   true,
            day:            true,
            startTime:      true,
            endTime:        true,
            language:       true,
            teacher:        true,
            errorMessage:   ''
          };

          this.instrumentList = [];

          this.teachers = [];

          this.CalcEndTimeInHours = function() {
            this.ProcessStartTime();
            var d;
            if (this.lesson.duration == 30) {
              d = new Date(1,1,1,this.lesson.startTime,30);
            } else {
              d = new Date(1,1,1,this.lesson.startTime + 1);
            }
            this.lesson.endTime = d.getHours() + d.getMinutes()/60;
          }

          this.DisplayEndTime = function() {
            this.CalcEndTimeInHours();

            var format = '';
            if(this.givenStartTime.search(":") != -1) format = ':00';
            if(this.lesson.endTime % 1 != 0) format = ':30';

            var timeHours = Math.floor(this.lesson.endTime);
            if(this.givenStartTime.search("am") != -1 || this.givenStartTime.search("pm") != -1) {
              if(timeHours > 12){
                return ((timeHours - 12) + format + 'pm');
              } else if (timeHours == 12) {
                return (timeHours + format + 'pm');
              } else {
                return (timeHours + format + 'am');
              }
            } else {
              if(timeHours > 10)
                return (timeHours + format);
              else 
                return (0 + timeHours.toString() + format);
            }
          }

          this.UpdateInstrumentSelect = function() {
            if(this.lesson.hireType == 'Hire' && this.lesson.instrumentId == '')
              this.isValid.instrumentId = false;
            else
              this.isValid.instrumentId = true;
          }

          this.dayList = [
              {short: "1", name:"Monday"}
            , {short: "2", name:"Tuesday"}
            , {short: "3", name:"Wednesday"}
            , {short: "4", name:"Thursday"}
            , {short: "5", name:"Friday"}
          ];
          
          this.durationList = [
              {short: "30", length:"30 Mins"}
            , {short: "60", length:"1 Hour"}
          ];
          this.ProcessStartTime = function() {
            var hours;
            if(this.givenStartTime.search(":") == -1) {
              if(this.givenStartTime.search("pm") == -1 || parseInt(this.givenStartTime) == 12) {
                hours = parseInt(this.givenStartTime);
              } else {
                hours = parseInt(this.givenStartTime) + 12;
              }
            } else if(this.givenStartTime.search("pm") == -1) {
              hours = parseInt(this.givenStartTime);
            } else {
              hours = parseInt(this.givenStartTime) + 12;
            }
            this.lesson.startTime = hours;
          }

          this.Register = function() {
            this.submitted = true;
            this.error = '';
            //Fix startTime
            this.CalcEndTimeInHours();
            //Send to registration Service
            //then redirect
            var availabilityCheck = {
                                      studentId: this.lesson.studentId,
                                      startTime: this.lesson.startTime,
                                      duration:  this.lesson.duration,
                                      day:       this.lesson.day
                                    };
            this.LessonApplicationService.CheckAvailability(availabilityCheck).then(response => {
              if(response._body == 'Available') {
                this.LessonApplicationService.AttemptLessonBooking(this.lesson).then(response => {
                  if(response.status) {
                    var link = ['/Confirmation'];
                    this.Router.navigate(link);
                  } else {
                    this.isValid = response.errorArray;
                    this.submitted = false;
                    this.error = this.isValid.errorMessage;
                  }
                }).catch(() => {
                  this.submitted = false;
                  this.error = 'An error has occured. Please try again later';
                });
              } else {
                this.submitted = false;
                this.error = 'Timeslot not Available.';
              }
            })
            .catch(() => {
              this.submitted = false;
              this.error = 'Timeslot not available.';
            });
          }

          this.FormIsAvailable = function() {

            if(this.UserService.IsSomeoneLoggedIn()) {
              var user = this.UserService.GetCurrentUser();
              if(user.type == 'student') {
                this.lesson.studentId = user.id;

                if(this.initialPermissionCheck) {
                  this.initialPermissionCheck = false;

                  var req = {
                    id: this.lesson.studentId
                  }

                  this.LessonApplicationService.StudentCanRegister(req)
                  .then(response => {

                    if(response.valid) {
                      this.studentIdValidated = true;
                      return true;
                    } else {
                      this.formUnavailableReason = 'You have already used all your lesson bookings.';
                      return false;
                    }
                  })
                  .catch(() => {
                    this.error = 'User unable to be validated.';
                  });
                } else if(this.studentIdValidated) return true;
                else return false;
              } else {
                this.formUnavailableReason = 'You are not logged in as a student.';
                return false;
              }
            } else {
              this.formUnavailableReason = 'You are not logged in.';
              return false;
            }
          }

          this.GetDatabaseValues = function() {
              this.LessonApplicationService.GetDatabaseValues()
              .then(response => {
                if(response.valid) {
                  this.instrumentTypeList = response.instrumentTypes;
                  this.languages = response.languages;
                } else {
                  this.error = response.error;
                }
              })
              .catch(() => {
                this.error = 'A Database connection could not be established.';
              });
          }

          this.ResetDependents = function() {
            this.lesson.hireType = '';
            this.ResetTeachers();
          }

          this.ResetTeachers = function() {
            this.lesson.teacher = '';
            this.lesson.emailInfo.teacherName = 'Any';
          }

          this.UpdateTeachers = function() {
            this.teachers = [];
            if(this.lesson.instrumentType && this.lesson.language) {
              this.LessonApplicationService.getTeachers(this.lesson.instrumentType, this.lesson.language)
              .then(response => {
                if(response.valid) {
                  this.teachers = response.teachers;
                } else {
                  this.error = response.error;
                }
              })
              .catch(() => {
                this.error = 'Instrument list was unable to be retrieved.';
              });
            }
          }

          this.UpdateDependents = function() {
            this.lesson.instrumentId = '';
            this.lesson.emailInfo.instrumentName = 'BYO';
              if(this.lesson.instrumentType) {
                this.LessonApplicationService.GetInstruments(this.lesson.instrumentType)
                .then(response => {
                  if(response.valid) {
                    this.instrumentList = response.instruments;
                  } else {
                    this.error = response.error;
                  }
                })
                .catch(() => {
                  this.error = 'Instrument list was unable to be retrieved.';
                });
              }

              this.UpdateTeachers();
          }

          this.SelectInstrument = function(instrument) {
              this.lesson.instrumentId = instrument.id;
              this.lesson.emailInfo.instrumentName = instrument.serial_no + ' ' + instrument.model;
          }
	      }
      ]
    });
    app.ApplicationFormComponent.prototype.ngOnInit = function() {
      this.GetDatabaseValues();
    };
})(window.app || (window.app = {}));