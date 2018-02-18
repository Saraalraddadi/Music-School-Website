/* Manages Instrument Return Routing */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/student/timetable/', function(request, response) {
		response.render('studentTimetable/index');
	});

	app.get('/student/timetable/getLessons/', function(request, response) {

		var studentID = request.query.id;

		var res = {
			valid: true,
			error: '',
			lessons: []
		}

		if (!validateId(studentID)) {
			res.valid = false;
			res.error = '';
			response.send(res);
			return;
		}

		var getLessonsQuery = {
			text: "SELECT l.id, "
					    +"t.first_name, "
					    +"t.last_name, "
					    +"it.name as instrument_type, "
					    +"l.lesson_day, "
					    +"l.lesson_start_time as start_time, "
					    +"l.lesson_end_time as end_time "
				 +"FROM music_school.lessons l, "
				 	  +"music_school.teachers t,  "
				 	  +"music_school.instrument_types it  "
				 +"WHERE l.teacher_id = t.id "
				   +"AND l.inst_type_id = it.id "
				   +"AND l.student_id = $1 "
				   +"AND l.request_status_id = 2 "
				 +"ORDER BY l.lesson_start_time ASC",
			name: "get-student-lessons",
			values: [
				studentID
			]
		}

		app.client.query(getLessonsQuery)
		.on('error', function(err) {
			res.valid = false;
			res.error = 'An error has occured. Please contact an administrator.';
			response.send(res);
			console.log('Error in StudentTimetablesRouting : getLessons : getLessonsQuery');
			console.log(getLessonsQuery);
			console.log(err);
		})
		.on('row', function(row) {
			res.lessons.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (res.lessons.length > 0) {
					response.send(res);
				} else {
					res.valid = false;
					res.error = 'You have no lessons.'
					response.send(res);
				}
			}
		});
	});

	app.get('/student/timetable/getLesson/', function(request, response) {

		var studentId = request.query.studentId;
		var lessonId = request.query.lessonId;

		var res = {
			valid: true,
			error: '',
			lesson: ''
		}

		if (!validateId(studentId) || !validateId(lessonId)) {
			res.valid = false;
			res.error = '';
			response.send(res);
			return;
		}

		var getLessonQuery = {
			text: "SELECT l.id, "
					    +"t.first_name, "
					    +"t.last_name, "
					    +"it.name as instrument_type, "
					    +"lang.language, "
					    +"l.lesson_day, "
					    +"l.lesson_start_time as start_time, "
					    +"l.lesson_end_time as end_time, "
					    +"l.lesson_year as year, "
					    +"l.lesson_term as term "
				 +"FROM music_school.lessons l, "
				 	  +"music_school.teachers t,  "
				 	  +"music_school.instrument_types it,  "
				 	  +"music_school.languages lang  "
				 +"WHERE l.teacher_id = t.id "
				   +"AND l.language_id = lang.id "
				   +"AND l.inst_type_id = it.id "
				   +"AND l.student_id = $1 "
				   +"AND l.id = $2 "
				   +"AND l.request_status_id = 2 "
				 +"ORDER BY l.lesson_start_time ASC",
			name: "get-student-lesson",
			values: [
				studentId,
				lessonId
			]
		}

		app.client.query(getLessonQuery)
		.on('error', function(err) {
			res.valid = false;
			res.error = 'An error has occured. Please contact an administrator.';
			response.send(res);
			console.log('Error in StudentTimetablesRouting : getLesson : getLessonQuery');
			console.log(getLessonQuery);
			console.log(err);
		})
		.on('row', function(row) {
			res.lesson = row;
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (res.lesson != '') {
					response.send(res);
				} else {
					res.valid = false;
					res.error = 'The lesson ID you have specified is invalid.'
					response.send(res);
				}
			}
		});
	});

	app.post('/student/timetable/cancelLesson',function(request, response) {
	  var cancelDetails = request.body;

	  var res = {
	  	valid: true,
	  	error: ''
	  }

	  if(!validateId(cancelDetails.lessonId) || !validateId(cancelDetails.studentId)) {
	  	//Invalid Ids
	  	res.valid = false;
	  	res.error = 'An invalid ID has been given.'
	  	response.send(res);
	  } else {
	  	//Ids are valid, can continue
	  	var finishLessonQuery = {
			text: "UPDATE music_school.lessons "
			  	 +"SET request_status_id = 7 "
			  	 +"WHERE id = $1 "
			  	   +"AND student_id = $2",
			name: "finish-lesson-student",
			values: [
				cancelDetails.lessonId,
				cancelDetails.studentId
			]
		};

		app.client.query(finishLessonQuery)
		.on('error', function(err) {
			res.valid = false;
			res.error = 'An error has occured. Please contact an administrator.';
			response.send(res);
			console.log('Error in studentTimetablesRouting : cancelLesson : finishLessonQuery');
			console.log(finishLessonQuery);
			console.log(err);
		})
		.on('end', function() {
			if (!response.headersSent) {
				response.send(res);
				sendCancelEmail(app, cancelDetails.lessonId);
			}
		});
	  }

	});

	function sendCancelEmail(app, lessonId) {
		var info = {};

		var getInfoQuery = {
			text: "SELECT s.first_name || ' ' || s.last_name as studentname, "
						+"s.email as studentEmail, "
						+"t.first_name || ' ' || t.last_name as teachername, "
						+"t.email as teacheremail, "
						+"it.name as instrument, "
						+"l.lesson_start_time as starttime, "
						+"l.lesson_end_time as endtime, "
						+"l.lesson_day as day "
				 +"FROM music_school.lessons l, music_school.students s, music_school.teachers t, music_school.instrument_types it "
				 +"WHERE l.student_id = s.id "
				   +"AND l.teacher_id = t.id "
				   +"AND l.inst_type_id = it.id "
				   +"AND l.id = $1",
			name: "get-cancelled-lesson-info",
			values: [
				lessonId
			]
		};

		app.client.query(getInfoQuery)
		.on('error', function(err) {
			console.log('Error in StudentTimetablesRouting : sendCancelEmail : getInfoQuery');
			console.log(getInfoQuery);
			console.log(err);
		})
		.on('row', function(row) {
			info = row;
		})
		.on('end', function() {
			if (info != {}) {
				var studentEmail = generateStudentEmail(app, info);
				app.transporter.sendMail(studentEmail, function(error, info) {
					if(error) {
						console.log('Error in StudentTimetablesRouting : sendCancelEmail : sendStudentEmail');
						console.log(studentEmail);
						console.log(error);
					}
				});

				var teacherEmail = generateTeacherEmail(app, info);
				app.transporter.sendMail(teacherEmail, function(error, info) {
					if(error) {
						console.log('Error in TeacherTimetablesRouting : sendCancelEmail : sendteacherEmail');
						console.log(teacherEmail);
						console.log(error);
					}
				});
			} else {
				console.log('No data received.')
			}
		});
	}

	app.get('/student/timetable/*', function(request, response) {
	  response.render('studentTimetable/index');
	});
}

function generateStudentEmail(app, info) {
	var textMessage = "Dear " + info.studentname + ", "
					 +"\n\nYou have successfully cancelled your lesson with " + info.teachername + "."
					 +"\nThe specific lesson was for the " + info.instrument + ", and normally occured on "+ app.weekdays[info.day] +" between "+ info.starttime +" and "+ info.endtime +"."
					 +"\nIf you think this was a mistake, please contact us."
					 +"\nWe hoped you enjoyed this lesson, and hopefully we will see you again!"
					 +"\n\nRegards,"
					 +"\nSchool of Music Team";

	return {
		from: '"School of Music Admin" <test@gmail.com>',
		to: info.studentemail,
		subject: "Cancelled Lesson",
		text: textMessage,
		html: toHTMLmessage(textMessage)
	};
}

function generateTeacherEmail(app, info) {
	var textMessage = "Dear " + info.teachername + ", "
					 +"\n\nYour lesson with " + info.studentname + " has successfully been cancelled."
					 +"\nThe specific lesson was for the " + info.instrument + ", and normally occured on "+ app.weekdays[info.day] +" between "+ info.starttime +" and "+ info.endtime +"."
					 +"\nIf you think this is a mistake, please contact us."
					 +"\n\nRegards,"
					 +"\nSchool of Music Team";

	return {
		from: '"School of Music Admin" <test@gmail.com>',
		to: info.teacheremail,
		subject: "Cancelled Lesson",
		text: textMessage,
		html: toHTMLmessage(textMessage)
	};
}

function toHTMLmessage(textMessage) {
	return textMessage.replace(new RegExp("^"), '<p>')
					  .replace(new RegExp("$"), '</p>')
					  .replace(new RegExp("\n\n","g"), '</p><br/><p>')
					  .replace(new RegExp("\n","g"), '</p><p>');
}

function validateId(id) {
	var regexp = new RegExp("^[1-9][0-9]*$");
	if (regexp.test(id)) {
		return true;
	}
	return false;
}