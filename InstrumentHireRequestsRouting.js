/* Routing for Accept/Reject Instrument Hire Requests */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/management/instrument/requests/', function(request, response) {
		response.render('instrumentHireRequests/index');
	});

	/* Get a list of all hire requests */
	app.get('/management/instrument/getInstrumentHireRequests/', function(request, response) {
		var instrumentHireRequestsResult = [];
		var result = {
			status: true,
			results: true,
			instrumentHireRequests: instrumentHireRequestsResult
		}

		var getQuery = {
			text:"SELECT ih.id as hireid, "
					   +"s.first_name as firstname, "
					   +"s.last_name as lastname, "
					   +"it.name as instrumenttype, "
					   +"i.model as instrumentname, "
					   +"TO_CHAR(ih.hire_date,'YYYY-MM-DD') as hiredate "
				+"FROM music_school.instrument_hire ih, "
					 +"music_school.students s, "
					 +"music_school.instrument_types it, "
					 +"music_school.instruments i "
				+"WHERE ih.student_id = s.id "
				  +"AND ih.instrument_id = i.id "
				  +"AND i.inst_type_id = it.id "
				  +"AND NOT ih.is_returned "
				  +"AND ih.hire_status_id = $1",
			name: 'get-instrument-requests', 
			values: [
				  1
			]
		}

		app.client.query(getQuery)
		.on('error', function(err) {
			if (!response.headersSent) {
				result.status = false;
				response.send(result);
			}
		})
		.on('row', function(row) {
			instrumentHireRequestsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (instrumentHireRequestsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					result.results = false;
					response.send(result);
				}
			}
		});
	});

	app.get('/management/instrument/requests/getIndividualRequest/', function(request, response) {
		var requestID = request.query.id;
		var hireRequest = [];
		var result = {
			status: true,
			instrumentHireRequest: hireRequest
		}

		if (!requestID) {
			result.status = false;
			response.send(result);
		} else {
			var getQuery = {
				text:"SELECT ih.id as hireid, "
						   +"s.first_name as firstname, "
						   +"s.last_name as lastname, "
						   +"s.phone_no as phone, "
						   +"s.email as email, "
						   +"TO_CHAR(ih.hire_date,'YYYY-MM-DD') as hiredate, "
						   +"it.name as instrumenttype, "
						   +"i.model as instrumentname, "
						   +"TO_CHAR(ih.due_date,'YYYY-MM-DD') as duedate, "
						   +"i.serial_no as serialnumber, "
						   +"c.condition as condition, "
						   +"TO_CHAR(i.purchase_date,'YYYY-MM-DD') as purchasedate, "
						   +"i.purchase_price as purchaseprice, "
						   +"i.hire_fee as hirefee "
					+"FROM music_school.instrument_hire ih, "
						 +"music_school.students s, "
						 +"music_school.instrument_types it, "
						 +"music_school.instruments i, "
						 +"music_school.conditions c "
					+"WHERE ih.student_id = s.id "
					  +"AND ih.instrument_id = i.id "
					  +"AND i.condition_id = c.id "
					  +"AND i.inst_type_id = it.id "
					  +"AND ih.id = $1 "
					  +"AND NOT ih.is_returned "
					  +"AND ih.hire_status_id = $2",
				name: 'get-instrument-request', 
				values: [
					  requestID
					, 1
				]
			}

			app.client.query(getQuery)
			.on('error', function(err) {
				if (!response.headersSent) {
					result.status = false;
					response.send(result);
				}
			})
			.on('row', function(row) {
				hireRequest.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					if (hireRequest.length > 0) {
						response.send(result);
					} else {
						result.status = false;
						response.send(result);
					}
				}
			});
		}
	});

	app.post('/management/instrument/requests/respondToRequest/accept/', function(request, response) {
		var hireID = request.body.hireID || false;

		var result = {
			status: true,
			error: ''
		}

		if (!hireID) {
			result.status = false;
			result.error = 'An error has occured. Contact the Administrators.'
			response.send(result);
		} else {
			var studentID;
			var returnQuery = {
				text:"UPDATE music_school.instrument_hire "
					+"SET hire_status_id = $1 "
					+"WHERE id = $2 "
					+"RETURNING student_id",
				name: "accept-instrument-request",
				values: [
					  2
					, hireID
				]
			}
			app.client.query(returnQuery)
			.on('error', function(err) {
				result.status = false;
				result.error = 'There was an error in the database. Try again later.'
				response.send(result);
			})
			.on('row', function(row) {
				studentID = row.student_id;
			})
			.on('end', function() {
				if (!response.headersSent) {
					sendHireRequestEmailToStudent("approved", response, hireID, studentID, result);
				}
			});
		}
	});

	app.post('/management/instrument/requests/respondToRequest/reject/', function(request, response) {
		var hireID = request.body.hireID;
		var result = {
			status: true,
		}

		if (!hireID) {
			result.status = false;
			response.send(result);
		} else {
			var studentID;
			var returnQuery = {
				text:"UPDATE music_school.instrument_hire "
					+"SET hire_status_id = $1 "
					+"WHERE id = $2 "
					+"RETURNING student_id",
				name: "accept-instrument-request",
				values: [
					  3
					, hireID
				]
			}
			app.client.query(returnQuery)
			.on('error', function(err) {
				result.status = false;
				result.error = 'There was an error in the database. Try again later.'
				response.send(result);
			})
			.on('row', function(row) {
				studentID = row.student_id;
			})
			.on('end', function() {
				if (!response.headersSent) {
					sendHireRequestEmailToStudent("rejected", response, hireID, studentID, result);
				}
			});
		}
	});

	app.get('/management/instrument/requests/*', function(request, response) {
	  response.render('instrumentHireRequests/index');
	});

	function sendHireRequestEmailToStudent(app_rej, response, hireID, studentID, result) {
		if (!response.headersSent) {
			var student;
			var getStudentEmailAndRequest = {
				text:"SELECT s.first_name as firstname, "
						   +"s.last_name as lastname, "
						   +"s.email as email, "
						   +"i.model as model, "
						   +"i.serial_no as serialnumber, "
						   +"it.name as type "
					+"FROM music_school.students s, "
						 +"music_school.instrument_hire ih, "
						 +"music_school.instruments i, "
						 +"music_school.instrument_types it "
					+"WHERE s.id = ih.student_id "
					  +"AND ih.instrument_id = i.id "
					  +"AND it.id = i.inst_type_id "
					  +"AND s.id = $1"
					  +"AND ih.id = $2",
				name: 'get-student-email-and-request',
				values: [
					  studentID
					, hireID
				]
			}
			app.client.query(getStudentEmailAndRequest)
			.on('error', function(err) {
			//Error emailing student - Inst is returned though.
				if (!response.headersSent) {
					response.send(result);
				}
			})
			.on('row', function(row) {
				student = row;
			})
			.on('end', function() {
				if (!response.headersSent) {
					var instrument = student.model + ' ' + student.type + ' ' + student.serialnumber;

					var textMessage = "Dear " + student.firstname + " " + student.lastname + ", "
									 +"\n\nOne of your instrument requests have been "+app_rej+": " + instrument + '.'
									 +(app_rej=='approved' ? "\nPlease come pick it up from our school at your earliest convenience.":"\nWe appologise for the inconvenience.")
									 +"\n\nRegards,"
									 +"\nSchool of Music";

					var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
												 .replace(new RegExp("$"), '</p>')
												 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
												 .replace(new RegExp("\n","g"), '</p><p>');

					var managerConfirmationEmail = {
						from: '"School of Music Admin" <test@gmail.com>',
						to: student.email,
						subject: "Instrument Request " + app_rej.replace(new RegExp("^."), app_rej.charAt(0).toUpperCase()),
						text: textMessage,
						html: htmlMessage
					};

					app.transporter.sendMail(managerConfirmationEmail, function(error, info) {
						if(error) {
							console.log(error);
						}
					});

					response.send(result);
				}
			});
		}
	}
}