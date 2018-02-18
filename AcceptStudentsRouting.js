exports.include = (app) => {
	require('./database.js');

	app.get('/teacher/studentApplications/', function(request, response) {
		response.render('acceptStudents/index');
	});

	app.get('/teacher/studentApplications/getStudents/', function(request, response) {

		var teacherID = request.query.id;
		var studentsResult = [];
		var result = {
			status: true,
			students: studentsResult
		}

		if (!teacherID) {
			teacherID = 1;
		}

		var getQuery = "SELECT l.id as requestid, s.first_name as firstname, s.last_name as lastname, "
						+"TO_CHAR(s.dob,'YYYY-MM-DD') as dob, it.name as instrument, se.grade as grade "
						+"FROM music_school.lessons l, music_school.students s, "
						+"music_school.instrument_types it, music_school.student_experience se "
						+"WHERE l.student_id = s.id AND l.inst_type_id = it.id "
						+"AND (l.teacher_id = "+teacherID+" OR l.teacher_id IS NULL) "
						+"AND (l.request_status_id IS NULL OR l.request_status_id = 1) "
						+"AND l.id NOT IN (SELECT lesson_id FROM music_school.lesson_rejections WHERE teacher_id="+teacherID+") "
						+"AND s.id = se.student_id AND se.inst_type_id = l.inst_type_id;";

		app.client.query(getQuery).on('row', function(row) {
			studentsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (studentsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					result.error = 'You have no lesson requests from any students.';
					response.send(result);
				}
			}
		});
	});

	app.get('/teacher/studentApplications/getStudent/', function(request, response) {

		var requestID = request.query.id;
		var student = [];
		var result = {
			status: true,
			student: student
		}

		var getQuery = "SELECT l.id as requestid, s.first_name as firstname, s.last_name as lastname, "
						+"TO_CHAR(s.dob,'YYYY-MM-DD') as dob, it.name as instrument, se.grade as grade, "
						+"l.lesson_start_time as starttime, l.lesson_end_time as endtime, l.lesson_year as year, "
						+"l.lesson_term as term, l.lesson_fee as fee, l.lesson_notes as notes, l.teacher_id as teacher "
						+"FROM music_school.lessons l, music_school.students s, "
						+"music_school.instrument_types it, music_school.student_experience se "
						+"WHERE l.student_id = s.id AND l.inst_type_id = it.id AND l.id = "+requestID
						+"AND s.id = se.student_id AND se.inst_type_id = l.inst_type_id";

		app.client.query(getQuery).on('row', function(row) {
			student.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (student.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		})
		.on('error', function() {
			result.status = false;
			response.send(result);
		});
	});

	/* Accept a student */
	app.post('/teacher/studentApplications/individual/accept/', function(request, response) {
		var requestID = request.body.request;
		var teacherID = request.body.teacher;
		var result = {
			status: true,
		}

		if (!teacherID) {
			teacherID = 1;
		}

		var acceptQuery = "UPDATE music_school.lessons SET request_status_id = 2, accept_date = NOW(), teacher_id ="+teacherID+" WHERE id = "+requestID+";";

		app.client.query(acceptQuery).on('error', function() {
			result.status = false;
			response.send(result);
		})
		.on('end', function() {
			if (!response.headersSent) {
				response.send(result);
			}
		})
	});

	app.post('/teacher/studentApplications/individual/reject/', function(request, response) {

		var requestID = request.body.request;
		var teacherID = request.body.teacher;
		var result = {
			status: true,
		}

		if (!teacherID) {
			teacherID = 1;
		}


		var rejectQuery = "UPDATE music_school.lessons SET request_status_id = 3 WHERE teacher_id ="+teacherID+" AND id = "+requestID+";"+
							" INSERT INTO music_school.lesson_rejections(lesson_id, teacher_id) VALUES ("+requestID+", "+teacherID+");";

		app.client.query(rejectQuery).on('error', function(err) {
			result.status = false;
			response.send(result);
		})
		.on('end', function() {
			if (!response.headersSent) {
				response.send(result);
			}
		})
	});

	app.get('/teacher/studentApplications/*', function(request, response) {
	  response.render('acceptStudents/index');
	});
}