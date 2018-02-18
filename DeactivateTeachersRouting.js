exports.include = (app) => {
	require('./database.js');

	app.get('/management/teachers/', function(request, response) {
		response.render('deactivateTeachers/index');
	});

	app.post('/management/teachers/individual/deactivate/', function(request, response) {
		var teacherID = request.body.id;
		var result = {
			status: true,
		}

		var regex = new RegExp("^[1-9][0-9]*$");

		if (!teacherID || !regex.test(teacherID)) {
			result.status = false;
			response.send(result);
		} else {

			var deactivateQuery = "UPDATE music_school.teachers SET date_terminated = NOW(), is_terminated = TRUE WHERE id = "+teacherID+"; "
						+"UPDATE music_school.lessons SET accept_date = NULL, request_status_id = 1, teacher_id = NULL WHERE teacher_id = "+teacherID+" AND request_status_id = 2; "
						+"INSERT INTO music_school.lesson_rejections(lesson_id, teacher_id) SELECT id, teacher_id FROM music_school.lessons WHERE teacher_id = "+teacherID+" AND request_status_id=1; "
						+"UPDATE music_school.lessons SET request_status_id = 3 WHERE teacher_id = "+teacherID+" AND request_status_id = 1; ";

			app.client.query(deactivateQuery).on('error', function(err) {
				console.log(err);
				result.status = false;
				response.send(result);
			})
			.on('end', function() {
				if (!response.headersSent) {
					response.send(result);
				}
			});
		}

	});

	app.post('/management/teachers/individual/reactivate/', function(request, response) {
		var teacherID = request.body.id;
		var result = {
			status: true,
		}

		if (!teacherID) {
			result.status = false;
			response.send(result);
		} else {

			var reactivateQuery = {
				text: "UPDATE music_school.teachers SET date_terminated = NULL, is_terminated = FALSE WHERE id = $1",
				name: "reactivate-deactivated-teacher",
				values: [
					teacherID
				]
			};

			app.client.query(reactivateQuery).on('error', function(err) {
				console.log(err);
				result.status = false;
				response.send(result);
			})
			.on('end', function() {
				if (!response.headersSent) {
					response.send(result);
				}
			});
		}

	});

	app.get('/management/teachers/getIndividualTeacher/', function(request, response) {
		var teacherID = request.query.id;
		var teacher = [];
		var result = {
			status: true,
			teacher: teacher
		}

		if (!teacherID) {
			result.status = false;
			response.send(result);
		} else {

			var getQuery = "SELECT id, first_name as firstname, last_name as lastname, TO_CHAR(dob,'YYYY-MM-DD') as dob, email as email, "
							+"address as address, phone_no as phone, TO_CHAR(date_employed,'YYYY-MM-DD') as dateemployed, is_terminated as deactived "
							+"FROM music_school.teachers WHERE id="+teacherID+";";

			app.client.query(getQuery).on('row', function(row) {
				teacher.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					if (teacher.length > 0) {
						response.send(result);
					} else {
						result.status = false;
						response.send(result);
					}
				}
			})
			.on('error', function(err) {
				result.status = false;
				response.send(result);
			});
		}
	});

	app.get('/management/teachers/getAllTeachers/', function(request, response) {
		var teachersResult = [];
		var result = {
			status: true,
			teachers: teachersResult
		}

		var getQuery = {
			text: "SELECT id, first_name as firstname, last_name as lastname, TO_CHAR(dob,'YYYY-MM-DD') as dob, email as email, "
					+"address as address, phone_no as phone, TO_CHAR(date_employed,'YYYY-MM-DD') as dateemployed "
					+"FROM music_school.teachers WHERE is_terminated = FALSE ORDER BY first_name ASC",
			name: "get-active-teachers",
			values: []
		};

		app.client.query(getQuery).on('row', function(row) {
			teachersResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (teachersResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/teachers/getAllTeachers/deactivated', function(request, response) {
		var teachersResult = [];
		var result = {
			status: true,
			teachers: teachersResult
		}

		var getQuery = {
			text: "SELECT id, first_name as firstname, last_name as lastname, TO_CHAR(dob,'YYYY-MM-DD') as dob, email as email, "
					+"address as address, phone_no as phone, TO_CHAR(date_employed,'YYYY-MM-DD') as dateemployed "
					+"FROM music_school.teachers WHERE is_terminated = TRUE ORDER BY first_name ASC",
			name: "get-deactivated-teachers",
			values: []
		};

		app.client.query(getQuery).on('row', function(row) {
			teachersResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (teachersResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/teachers/*', function(request, response) {
	  response.render('deactivateTeachers/index');
	});
}