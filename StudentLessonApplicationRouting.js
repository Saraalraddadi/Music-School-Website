/* Routing for Student Lesson Applications */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/lessons/application/', function(request, response) {
	  response.render('lessonApplication/index');
	});

	/* Check if Current Student Is Allowed To Register a Lesson */
	app.post('/lessons/application/checkStudent', function(request, response) {
		var student = request.body;

		//Setup response
		var res = {
			valid: false
		};

		//Validate
		if(validNumber(student.id)) {
			//Setup Query
			var checkStudentIdQuery = {
				text: "SELECT * FROM music_school.students_allowed_applications saa "
					 +"WHERE saa.id = $1",
				name: 'check-student-id',
				values: [
					  student.id
				]
			};

			//Run Query
			app.client.query(checkStudentIdQuery) 
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					console.log("Errors Happened in stntIdChk 1: ", err);
					response.send(valid);
				}
			})
			.on('row', function(row) {
				/* Student Was there */
				if (!response.headersSent) {
					res.valid = true;
					response.send(res);
				}
			})
			.on('end', function() {
				/* Student wasn't there */
				if (!response.headersSent) {
					response.send(res);
				}
			});
		} else {
			response.send(res);
		}
	});

	/* Register Lesson */
	app.post('/lessons/application/', function(request, response) {
		validateInstId = false;
		var lesson = request.body;

		/* Setup error Array */
		var isValid = {
			instrumentType: true,
            hireType: true,
            grade: true,
            studentId: true,
            language: true,
            teacher: true,
            instrumentId: true,
            day: true,
            startTime: true,
            endTime: true,
            errorMessage:''
		};

		/* Setup response frame */
		var valid = {
			status:false,
			errorArray:isValid
		};

		/* Run validation */
		if (validateAll(lesson, isValid)) {
			valid.status = true;
			if(!validateInstId) lesson.instrumentId = '';
		} else {
			valid.status = false;
			valid.errorArray = isValid;
			response.send(valid);
		}

		/* If is valid */
		if(valid.status) {
			/* Convert inputs into Database structure */
			var d = new Date();

			var databaseStartTimeString = TurnIntoDBTime(lesson.startTime);
			var databaseEndTimeString = TurnIntoDBTime(lesson.endTime);

			/* Setup queries */
			var lessonColumns = "student_id, inst_type_id, request_date, request_status_id, lesson_start_time, lesson_end_time, lesson_day, lesson_year, lesson_term, lesson_fee, language_id";
			var newLessonParams = "$1,$2,now(),1,$3,$4,$5,$6,$7,$8,$9";
			var newLessonValues = [
					  lesson.studentId
					, lesson.instrumentType
					, databaseStartTimeString
					, databaseEndTimeString
					, lesson.day
					, 2016
					, 4
					, 30
					, lesson.language
				];

			if(lesson.teacher != 0) {
				lessonColumns += ', teacher_id';
				newLessonParams += ",$10";
				newLessonValues.push(lesson.teacher);
			}

			var newLessonText = "INSERT INTO music_school.lessons("+lessonColumns+") VALUES("+newLessonParams+")";

			var experienceColumns = "student_id, inst_type_id, grade";

			var newExperienceQuery = {
				text: "INSERT INTO music_school.student_experience("+experienceColumns+") VALUES("
					+"$1,$2,$3"
				+") ON CONFLICT (student_id, inst_type_id) DO UPDATE SET grade = $3",
				name: 'log-experience-lesson',
				values: [
					  lesson.studentId
					, lesson.instrumentType
					, lesson.grade
				]
			};

			var instrumentHireColumns = "instrument_id, student_id, request_date, hire_status_id, is_returned";

			var instrumentHireQuery = {
				text: "INSERT INTO music_school.instrument_hire("+instrumentHireColumns+") VALUES("
					+"$1,$2,now(),$3,$4"
				+")",
				name: 'instrument-hire-request',
				values: [
					  lesson.instrumentId
					, lesson.studentId
					, 1
					, false
				]
			};

			/* Run queries */
			app.client.query(newLessonText, newLessonValues) //Run First Query
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					valid.status = false;
					isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened in StdntLsnAppRting 1: ", err);
					response.send(valid);
				}
			}).on('end', function() {
				app.client.query(newExperienceQuery) //Run Second Query
				.on('error', function(err) {
					/* Error Handling */
					if (!response.headersSent) {
						valid.status = false;
						isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
						console.log("Errors Happened in StdntLsnAppRting 2: ", err);
						response.send(valid);
					}
				}).on('end', function() {
					if(lesson.hireType == 'Hire') {
						app.client.query(instrumentHireQuery) //Run Third Query
						.on('error', function(err) {
							/* Error Handling */
							if (!response.headersSent) {
								valid.status = false;
								isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
								console.log("Errors Happened in StdntLsnAppRting 3: ", err);
								response.send(valid);
							}
						}).on('end', function() {
							/* All queries ran: lesson registered + instrument requested */
							if (!response.headersSent) {
								emailStudent(lesson);
								response.send(valid);
							}
						});
					} else {
						/* All queries ran: lesson registered */
						if (!response.headersSent) {
							emailStudent(lesson);
							response.send(valid);
						}
					}
				});
			});
		} else if (!response.headersSent) {
			/* Error Handling */
			console.log("Invalid data in StdntLsnAppRting 4:", request.body);
			response.send(valid);
		}
	});

	function emailStudent(lesson) {
		var student = {
			first_name: '',
			last_name: '',
			email: ''
		};

		this.emailInfo = {
			instrumentTypeDesc: '',
			instrumentName: ''
		};

		getStudentDetailsQuery = "SELECT s.first_name, s.last_name, s.email FROM music_school.students s WHERE id = $1";

		app.client.query(getStudentDetailsQuery, [lesson.studentId])
		.on('error', function(err) {
			console.log('An error has occurred in Lesson Application email students:');
			console.log(err);
		})
		.on('row', function(row) {
			student = row;
		})
		.on('end', function() {
			if(student.email != '') {
				var textMessage = "Dear " + student.first_name + " " + student.last_name + ", "
							 +"\n\nYou have applied for a lesson at The School of Music."
							 +"\nThe lesson details are as followed:"
							 +"\nInstrument Type: \t"+ lesson.emailInfo.instrumentTypeDesc
							 +"\nInstrument Hired:\t"+ lesson.emailInfo.instrumentName
							 +"\nLesson Time:     \t"+ processTime(lesson.startTime) + " - " + processTime(lesson.endTime)
							 +"\nTeacher:         \t"+ lesson.emailInfo.teacherName
							 +"\n\nRegards,"
							 +"\nSchool of Music Team";

				var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
											 .replace(new RegExp("$"), '</p>')
											 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
											 .replace(new RegExp("\n","g"), '</p><p>');

				var managerConfirmationEmail = {
					from: '"School of Music Admin" <test@gmail.com>',
					to: student.email,
					subject: "Lesson Booking Successful",
					text: textMessage,
					html: htmlMessage
				};

				app.transporter.sendMail(managerConfirmationEmail, function(error, info) {
					if(error) {
						console.log(error);
					}
				});
			}
		});
	}

	/* Gets all Instrument Types */
	app.get('/lessons/application/getDatabaseValues', function(request, response){
		//setup response frame
		var res = {
			valid: true,
			instrumentTypes: [],
			languages: [],
			error: ''
		};
		
		var getInstrumentTypesQuery = {
			text: "SELECT * FROM music_school.instrument_types",
			name: "get-instruments-types"
		};

		var getLanguages = {
			text: "SELECT * FROM music_school.languages",
			name: "get-languages"
		};

		app.client.query(getInstrumentTypesQuery)
		.on('error', function(err) {
			/* Error Handling */
			if (!response.headersSent) {
				res.valid = false;
				res.errorMessage = 'An error has occured. Please try again later or contact an administrator';
				console.log("Errors Happened within DatabaseFunctions: ", err);
				response.send(res);
			}
		}).on('row', function(row) {
			//Add instrument types to array
			res.instrumentTypes.push(row);
		})
		.on('end', function() {
			//return response
			if (!response.headersSent) {
				app.client.query(getLanguages)
				.on('error', function(err) {
					/* Error Handling */
					if (!response.headersSent) {
						res.valid = false;
						res.errorMessage = 'An error has occured. Please try again later or contact an administrator';
						console.log("Errors Happened within DatabaseFunctions - getLanguages: ", err);
						response.send(res);
					}
				}).on('row', function(row) {
					//Add instrument types to array
					res.languages.push(row);
				})
				.on('end', function() {
					//return response
					if (!response.headersSent) {
						response.send(res);
					}
				});
			}
		});
	});

	app.get('/lessons/application/*', function(request, response) {
	  response.render('lessonApplication/index');
	});
}

/* Validation Functions */
var validateInstId = false;

function processTime(time) {
	var response = '';
	if(time > 12)
		response = (time-12)+'pm';
	else 
		response = time+'am';

	return response;
}

function TurnIntoDBTime(time) {
	var res = '';
	if (time < 10)
		res = "0" + Math.floor(time).toString();
	else
		res = Math.floor(time).toString();

	if(time % 1 != 0) {
		res += ':30';
	} else {
		res += ":00";
	}

	return res;

}

function validateAll(lesson, isValid) {
	if (validateInstrumentType(lesson.instrumentType, isValid) &&
		validateGrade(lesson.grade, isValid) &&
		validateHireType(lesson.hireType, isValid) &&
		validateStudentId(lesson.studentId, isValid) &&
		validateInstrumentId(lesson.instrumentId, isValid) &&
		validateDay(lesson.day, isValid) &&
		validateLanguage(lesson.language, isValid) &&
		validateTeacher(lesson.teacher, isValid) &&
		validateStartTime(lesson.startTime, isValid) &&
		validateEndTime(lesson.endTime, isValid)) {
		return true;
	} else {
		return false;
	}
}

function validateGrade(grade, isValid) {
	var regexp = new RegExp("^[0-7]$");
	if (regexp.test(grade)) {
		return true;
	}
	isValid.instrumentType = false;
	return false;
}

function validateInstrumentType(instrumentType, isValid) {
	if (validNumber(instrumentType)) {
		return true;
	}
	isValid.instrumentType = false;
	return false;
}

function validateHireType(hireType, isValid) {
	var regexpBYO = new RegExp("^BYO$");
	var regexpHire = new RegExp("^Hire$");
	if (regexpBYO.test(hireType)) {
		return true;
	} if (regexpHire.test(hireType)) {
		validateInstId = true;
		return true;
	}
	isValid.hireType = false;
	return false;
}

function validateStudentId(studentId, isValid) {
	if (validNumber(studentId)) {
		return true;
	}
	isValid.instrumentId = false;
	return false;
}

function validateInstrumentId(instrumentId, isValid) {
	if(!validateInstId) return true;

	if (validNumber(instrumentId)) {
		return true;
	}
	isValid.instrumentId = false;
	return false;
}

function validateLanguage(languageId, isValid) {
	if (validNumber(languageId)) {
		return true;
	}
	isValid.language = false;
	return false;
}

function validateTeacher(teacherId, isValid) {
	if (validNumber(teacherId)) {
		return true;
	}
	isValid.teacher = false;
	return false;
}

function validateDay(day, isValid) {
	var regexp = new RegExp("^[1-5]$");
	if (regexp.test(day)) {
		return true;
	}
	isValid.day = false;
	return false;
}

function validateStartTime(startTime, isValid) {
	var regexp = new RegExp("^[6-9]$|^1[0-8]$");
	if (regexp.test(startTime)) {
		return true;
	}
	isValid.startTime = false;
	return false;
}

function validateEndTime(endTime, isValid) {
	var regexp = new RegExp("^[7-9](\.5)?$|^1[0-9](\.5)?$");
	if (regexp.test(endTime)) {
		return true;
	}
	isValid.endTime = false;
	return false;
}

function validNumber(number) {
	var regexp = new RegExp("^[0-9]+$");
	if(regexp.test(number)) return true;
	return false;
}