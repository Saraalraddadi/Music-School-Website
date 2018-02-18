/* Manages Instrument Return Routing */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/management/instrument/return/', function(request, response) {
		response.render('returnInstruments/index');
	});

	/* Get Instrument Hire List */
	app.get('/management/instruments/getInstruments/', function(request, response) {

		var instrumentsResult = [];
		var res = {
			valid: true,
			results: true,
			instruments: instrumentsResult
		}

		var getQuery = {
			text:"SELECT ih.id as hireid, "
					   +"s.first_name as firstname, "
					   +"s.last_name as lastname, "
					   +"it.name as instrumenttype, "
					   +"i.model as instrumentname, "
					   +"TO_CHAR(ih.due_date,'YYYY-MM-DD') as duedate "
				+"FROM music_school.instrument_hire ih, "
					 +"music_school.students s, "
					 +"music_school.instrument_types it, "
					 +"music_school.instruments i "
				+"WHERE ih.student_id = s.id "
				  +"AND ih.instrument_id = i.id "
				  +"AND i.inst_type_id = it.id "
				  +"AND NOT ih.is_returned "
				  +"AND ih.hire_status_id = $1",
			name: 'get-all-instrument-hires', 
			values: [
				  2
			]
		}

		app.client.query(getQuery).on('row', function(row) {
			instrumentsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (instrumentsResult.length > 0) {
					response.send(res);
				} else {
					res.valid = false;
					res.results = false;
					response.send(res);
				}
			}
		});
	});

	/* Get Details of Specific Instrument Hire */
	app.get('/management/instruments/getInstrument/', function(request, response) {
		var hireID = +request.query.id;
		var instrument = [];
		var result = {
			status: true,
			instrument: instrument
		}

		if (!hireID) {
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
				name: 'get-specific-instrument-hire', 
				values: [
					  hireID
					, 2
				]
			};

			app.client.query(getQuery)
			.on('error', function(err) {
				result.status = false;
				response.send(result);
			})
			.on('row', function(row) {
				instrument.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					if (instrument.length > 0) {
						response.send(result);
					} else {
						result.status = false;
						response.send(result);
					}
				}
			});
		}

	});

	/* Return a specific Instrument */
	app.post('/management/instruments/individual/return/', function(request, response) {

		var hireID = request.body.requestID;
		var result = {
			status: true,
		}

		if (!hireID) {
			result.status = false;
			response.send(result);
		} else {
			var studentId;
			var returnQuery = {
				text:"UPDATE music_school.instrument_hire "
					+"SET return_date = NOW(), "
						+"hire_status_id = $1, "
						+"is_returned = $2 "
					+"WHERE id = $3 "
					+"RETURNING student_id",
				name: 'mark-instrument-returned',
				values: [
					  6
					, true
					, hireID
				]
			}

			app.client.query(returnQuery)
			.on('error', function(err) {
				if (!response.headersSent) {
					result.status = false;
					response.send(result);
				}
			})
			.on('row', function(row) {
				studentId = row.student_id;
			})
			.on('end', function() {
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
							  studentId
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
											 +"\n\nOne of your instruments has been marked as returned: " + instrument + '.'
											 +"\n\nRegards,"
											 +"\nSchool of Music Team";

							var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
														 .replace(new RegExp("$"), '</p>')
														 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
														 .replace(new RegExp("\n","g"), '</p><p>');

							var managerConfirmationEmail = {
								from: '"School of Music Admin" <test@gmail.com>',
								to: student.email,
								subject: "Instrument has been returned",
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
			});
		}


	});

	app.get('/management/instrument/return/*', function(request, response) {
	  response.render('returnInstruments/index');
	});
}