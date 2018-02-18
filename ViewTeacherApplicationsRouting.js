exports.include = (app) => {
	require('./database.js');

	app.get('/management/teacherApplications/', function(request, response) {
		response.render('viewTeacherApplications/index');
	});

	app.get('/management/teacherApplications/getTeacherApplications/', function(request, response) {

		var teacherApplicationsResult = [];
		var result = {
			status: true,
			teacherApplications: teacherApplicationsResult,
		}


		var getQuery = "SELECT is_shortlisted as shortlisted, status_id as status, ta.id, first_name as firstname, last_name as lastname, hours, "
						+"TO_CHAR(dob,'YYYY-MM-DD') as dob, date_applied as dateapplied, "
						+"array_to_string(array_agg(DISTINCT instrument), ', ') as instruments, "
						+"array_to_string(array_agg(DISTINCT l.language), ', ') as languages "
						+"FROM music_school.teacher_applicants ta "
						+"INNER JOIN music_school.teacher_applicant_experience tae ON ta.id = tae.teacher_applicant_id "
						+"INNER JOIN music_school.teacher_applicant_languages tal ON ta.id = tal.applicant_id "
						+"INNER JOIN music_school.languages l ON tal.language_id = l.id "
						+"WHERE status_id = 1 "
						+"GROUP BY ta.id "
						+"ORDER BY date_applied DESC";

		app.client.query(getQuery).on('row', function(row) {
			teacherApplicationsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (teacherApplicationsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/teacherApplications/getTeacherApplications/all/', function(request, response) {

		var teacherApplicationsResult = [];
		var result = {
			status: true,
			teacherApplications: teacherApplicationsResult,
		}


		var getQuery = "SELECT is_shortlisted as shortlisted, status_id as status, ta.id, first_name as firstname, last_name as lastname, hours, "
						+"TO_CHAR(dob,'YYYY-MM-DD') as dob, date_applied as dateapplied, "
						+"array_to_string(array_agg(DISTINCT instrument), ', ') as instruments, "
						+"array_to_string(array_agg(DISTINCT l.language), ', ') as languages "
						+"FROM music_school.teacher_applicants ta "
						+"INNER JOIN music_school.teacher_applicant_experience tae ON ta.id = tae.teacher_applicant_id "
						+"INNER JOIN music_school.teacher_applicant_languages tal ON ta.id = tal.applicant_id "
						+"INNER JOIN music_school.languages l ON tal.language_id = l.id "
						+"WHERE status_id IN (1,3) "
						+"GROUP BY ta.id "
						+"ORDER BY date_applied DESC";

		app.client.query(getQuery).on('row', function(row) {
			teacherApplicationsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (teacherApplicationsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/teacherApplications/getTeacherApplications/shortlisted/', function(request, response) {

		var teacherApplicationsResult = [];
		var result = {
			status: true,
			teacherApplications: teacherApplicationsResult,
		}


		var getQuery = "SELECT is_shortlisted as shortlisted, status_id as status, ta.id, first_name as firstname, last_name as lastname, hours, "
						+"TO_CHAR(dob,'YYYY-MM-DD') as dob, date_applied as dateapplied, "
						+"array_to_string(array_agg(DISTINCT instrument), ', ') as instruments, "
						+"array_to_string(array_agg(DISTINCT l.language), ', ') as languages "
						+"FROM music_school.teacher_applicants ta "
						+"INNER JOIN music_school.teacher_applicant_experience tae ON ta.id = tae.teacher_applicant_id "
						+"INNER JOIN music_school.teacher_applicant_languages tal ON ta.id = tal.applicant_id "
						+"INNER JOIN music_school.languages l ON tal.language_id = l.id "
						+"WHERE status_id = 1 AND is_shortlisted = TRUE "
						+"GROUP BY ta.id "
						+"ORDER BY date_applied DESC";

		app.client.query(getQuery).on('row', function(row) {
			teacherApplicationsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (teacherApplicationsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/teacherApplications/getTeacherApplication/', function(request, response) {

		var teacherApplicationID = request.query.id;
		var teacherApplication = [];
		var languages = [];
		var instruments = [];
		var references = [];
		var result = {
			status: true,
			teacherApplication: teacherApplication,
			languages: languages,
			instruments: instruments,
			references: references
		}

		var getQuery = {
			text: "SELECT is_shortlisted as shortlisted, status_id as status, id, first_name as firstname, last_name as lastname, email, cover_letter as coverletter, phone_no as phone "
					+",TO_CHAR(dob,'YYYY-MM-DD') as dob "
					+"FROM music_school.teacher_applicants "
					+"WHERE id = $1",
			name: "get-individual-teacher-application",
			values: [
				teacherApplicationID
			]
		}

		var languagesQuery = {
			text: "SELECT language_id as id, language as name "
					+"FROM music_school.teacher_applicant_languages tal LEFT JOIN music_school.languages l ON tal.language_id = l.id "
					+"WHERE applicant_id = $1",
			name: "get-teacher-applicant-languages",
			values: [
				teacherApplicationID
			]
		}

		var referencesQuery = {
			text: "SELECT name, phone_number as phone "
					+"FROM music_school.teacher_applicant_references "
					+"WHERE teacher_applicant_id = $1",
			name: "get-teacher-applicant-references",
			values: [
				teacherApplicationID
			]
		}

		var instrumentsQuery = {
			text: "SELECT instrument, grade "
					+"FROM music_school.teacher_applicant_experience "
					+"WHERE teacher_applicant_id = $1",
			name: "get-teacher-applicant-instruments",
			values: [
				teacherApplicationID
			]
		}

		app.client.query(getQuery).on('row', function(row) {
			teacherApplication.push(row);
		})
		.on('end', function() {
			app.client.query(languagesQuery).on('row', function(row) {
				languages.push(row);
			})
			.on('error', function(err) {
				console.log(err);
				result.status = false;
				response.send(result);
			})
			.on('end', function() {
				app.client.query(referencesQuery).on('row', function(row) {
					references.push(row);
				})
				.on('error', function(err) {
					console.log(err);
					result.status = false;
					response.send(result);
				})
				.on('end', function() {
					app.client.query(instrumentsQuery).on('row', function(row) {
						instruments.push(row);
					})
					.on('error', function(err) {
						console.log(err);
						result.status = false;
						response.send(result);
					})
					.on('end', function() {
						if (!response.headersSent) {
							if (teacherApplication.length > 0) {
								response.send(result);
							} else {
								result.status = false;
								response.send(result);
							}
						}
					})
				})
			})
		})
		.on('error', function(err) {
			console.log(err);
			result.status = false;
			response.send(result);
		});
	});

	app.post('/management/teacherApplications/individual/shortlist/', function(request,response) {
		var applicationID = request.body.id;
		var name = request.body.name;
		var email = request.body.email;
		var result = {
			status: true,
		};

		var shortlistQuery = {
			text: "UPDATE music_school.teacher_applicants SET is_shortlisted = TRUE, status_id = $1 WHERE id = $2",
			name: "shortlist-application-query",
			values: [
				1
				,applicationID
			]
		}

		app.client.query(shortlistQuery).on('error', function(err) {
			result.status = false;
			response.send(result);
		})
		.on('end', function() {

			var textMessage = "Dear " + name + ", "
						 +"\n\nThank you for your application."
						 +"\nYou have been shortlisted for a position at the School of Music."
						 +"\nYou will be called if you are selected for an interview."
						 +"\n\nRegards,"
						 +"\nSchool of Music Team";

			var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
										 .replace(new RegExp("$"), '</p>')
										 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
										 .replace(new RegExp("\n","g"), '</p><p>');

			var teacherShortlistConfirmation = {
				from: '"School of Music Admin" <test@gmail.com>',
				to: email,
				subject: "Update on your Teacher Application",
				text: textMessage,
				html: htmlMessage
			};

			app.transporter.sendMail(teacherShortlistConfirmation, function(error, info) {
				if(error) {
					console.log(error);
				}
			});

			if (!response.headersSent) {
				response.send(result);
			}
		})
	});

	app.post('/management/teacherApplications/individual/reject/', function(request, response) {
		var applicationID = request.body.id;
		var name = request.body.name;
		var email = request.body.email;
		var result = {
			status: true,
		}

		var rejectQuery = {
			text: "UPDATE music_school.teacher_applicants SET status_id = $1, is_shortlisted = FALSE WHERE id = $2",
			name: "reject-application-query",
			values: [
				3
				,applicationID
			]
		}

		app.client.query(rejectQuery).on('error', function() {
			result.status = false;
			response.send(result);
		})
		.on('end', function() {

			var textMessage = "Dear " + name + ", "
						 +"\n\nUnfortunately you have not been selected at this time for a position at the School of Music."
						 +"\nYour application will be kept in case a future position becomes available that you are suitable for."
						 +"\nThank you for your interest."
						 +"\n\nRegards,"
						 +"\nSchool of Music Team";

			var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
										 .replace(new RegExp("$"), '</p>')
										 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
										 .replace(new RegExp("\n","g"), '</p><p>');

			var teacherConfirmationEmail = {
				from: '"School of Music Admin" <test@gmail.com>',
				to: email,
				subject: "Update on your Teacher Application",
				text: textMessage,
				html: htmlMessage
			};

			app.transporter.sendMail(teacherConfirmationEmail, function(error, info) {
				if(error) {
					console.log(error);
				}
			});

			if (!response.headersSent) {
				response.send(result);
			}
		})
	});

	app.get('/management/teacherApplications/*', function(request, response) {
	  response.render('viewTeacherApplications/index');
	});
}