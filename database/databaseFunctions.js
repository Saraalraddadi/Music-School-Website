/* Routing For Database Functions */
exports.include = (app) => {
	require('../database.js');

	app.post('/database/checkAvailability/', function(request, response) {
		var availabilityCheck = request.body;
		/*
			{
				studentId: ,
				startTime: ,
				duration:   ,
				day:       
			}
		*/
		if(availabilityCheck.studentId == '' 
		 ||availabilityCheck.startTime == ''
		 ||availabilityCheck.duration == ''
		 ||availabilityCheck.day == '') response.send('Unavailable');
		else {
			response.send('Available');
		}
	});

	app.get('/database/getUserDetails', function(request, response){
		var userId = request.query.id;
		var type = request.query.type;
		//setup response object
		var res = {
			valid: (validateGeneral(userId) && validateGeneral(type)),
			user: {},
			error: ''
		};

		if(res.valid) {
			var getUserDetailsQuery = "SELECT u.first_name, "
											+"u.middle_name, "
											+"u.last_name, "
											+"to_char(u.dob,'DD/MM/YYYY') as dob, "
											+"u.address, "
											+"u.phone_no, "
											+"u.email, "
											+"u.gender "
									 +"FROM music_school." + type + "s u "
									 +"WHERE id = $1";
			var getUserDetailsValues = [userId];

			app.client.query(getUserDetailsQuery, getUserDetailsValues)
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within DatabaseFunctions getUserDetails:");
					console.log("Params: userId = ", userId, " / type = ", type);
					console.log("query: \n", getUserDetailsQuery);
					console.log("\n",err);
					response.send(res);
				}
			})
			.on('row', function(row) {
				//Add instruments to array
				res.user = row;
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					response.send(res);
				}
			});
		} else {
			res.error = 'Regex is broken or we are being hacked.'
			response.send(res);
		}
	});

	app.get('/database/getTeacherSkills', function(request, response){
		var userId = request.query.id;
		//setup response object
		var res = {
			valid: validateGeneral(userId),
			instruments: [],
			grades: [],
			allInstruments: [],
			languages: [],
			allLanguages: [],
			error: ''
		};

		if(res.valid) {
			var getAllInstrumentsQuery = {
				text: "SELECT it.*"
					 +"FROM music_school.instrument_types it",
				name: "get-all-instruments",
				values: []
			};

			var getAllLanguagesQuery = {
				text: "SELECT l.*"
					 +"FROM music_school.languages l",
				name: "get-all-languages",
				values: []
			};

			app.client.query(getAllInstrumentsQuery)
			.on('error', function(err){})
			.on('row', function(row) {res.allInstruments.push(row)});

			app.client.query(getAllLanguagesQuery)
			.on('error', function(err){})
			.on('row', function(row) {res.allLanguages.push(row)});

			
			var getTeacherInstrumentsQuery = {
				text: "SELECT it.id, it.name, te.grade "
					 +"FROM music_school.teachers t, "
					 	  +"music_school.teacher_experience te, "
					 	  +"music_school.instrument_types it "
					 +"WHERE t.id = te.teacher_id "
					   +"AND te.inst_type_id = it.id "
					   +"AND t.id = $1",
				name: "get-teacher-instruments",
				values: [userId]
			};

			var getTeacherLanguagesQuery = {
				text: "SELECT l.id, l.language "
					 +"FROM music_school.teachers t, "
					 	  +"music_school.teacher_languages tl, "
					 	  +"music_school.languages l "
					 +"WHERE t.id = tl.teacher_id "
					   +"AND tl.language_id = l.id "
					   +"AND t.id = $1",
				name: "get-teacher-languages",
				values: [userId]
			};

			app.client.query(getTeacherInstrumentsQuery)
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within DatabaseFunctions getTeacherSkills : getTeacherInstrumentsQuery");
					console.log("Params: userId = ", userId);
					console.log("query: \n", getTeacherInstrumentsQuery);
					console.log("\n",err);
					response.send(res);
				}
			})
			.on('row', function(row) {
				//Add instruments to array
				res.instruments.push(row.id);
				res.grades[row.id - 1] = row.grade;
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					app.client.query(getTeacherLanguagesQuery)
					.on('error', function(err) {
						/* Error Handling */
						if (!response.headersSent) {
							res.valid = false;
							res.error = 'An error has occured. Please try again later or contact an administrator';
							console.log("Errors Happened within DatabaseFunctions getTeacherSkills : getTeacherLanguagesQuery");
							console.log("Params: userId = ", userId);
							console.log("query: \n", getTeacherLanguagesQuery);
							console.log("\n",err);
							response.send(res);
						}
					})
					.on('row', function(row) {
						//Add instruments to array
						res.languages.push(row.id);
					})
					.on('end', function() {
						//return response
						if (!response.headersSent) {
							response.send(res);
						}
					});
				}
			});
		} else {
			res.error = 'Regex is broken or we are being hacked.'
			response.send(res);
		}
	});

	/* Gets all Instrument Types */
	app.get('/database/getInstrumentTypes', function(request, response){
		//setup response frame
		var res = {
			valid: true,
			instrumentTypes: [],
			error: ''
		};
		
		var getInstrumentTypesQuery = {
			text: "SELECT * FROM music_school.instrument_types",
			name: "get-instruments-types"
		};

		app.client.query(getInstrumentTypesQuery).on('error', function(err) {
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
				response.send(res);
			}
		});
	});

	/* Gets All Conditions */
	app.get('/database/getConditions', function(request, response) {
		//setup response frame
		var res = {
			valid: true,
			conditions: [],
			error: ''
		};
		
		var getInstrumentTypesQuery = {
			text: "SELECT * FROM music_school.conditions",
			name: "get-conditions"
		};

		app.client.query(getInstrumentTypesQuery).on('error', function(err) {
			/* Error Handling */
			if (!response.headersSent) {
				res.valid = false;
				res.errorMessage = 'An error has occured. Please try again later or contact an administrator';
				console.log("Errors Happened within DatabaseFunctions: ", err);
				response.send(res);
			}
		}).on('row', function(row) {
			//add conditions to array
			res.conditions.push(row);
		})
		.on('end', function() {
			//return response
			if (!response.headersSent) {
				response.send(res);
			}
		});
	});

	/* Gets all Instruments of particular instrument Type */
	app.get('/database/getInstruments', function(request, response){
		var instrumentTypeId = request.query.id;
		var all = request.query.all;
		//setup response frame
		var res = {
			valid: false,
			instruments: [],
			error: ''
		};

		//Validate param (stop Injection attacks)
		res.valid = validateGeneral(instrumentTypeId);
		
		if(res.valid) {
			var getInstrumentsQuery;
			var conditionRestriction = '';
			if(!all){
				conditionRestriction = 'AND i.condition_id NOT IN (5)';
			}
			
			getInstrumentsQuery = {
				text: "SELECT i.id, i.serial_no, i.model, i.hire_fee, c.condition, i.inst_notes"
					 +" FROM music_school.instruments i, music_school.conditions c "
					 +"WHERE i.condition_id = c.id AND inst_type_id = $1 AND i.id NOT IN (SELECT instrument_id FROM music_school.instrument_hire "
					 	+"WHERE is_sold_or_disposed = FALSE AND hire_status_id NOT IN (6))" + conditionRestriction,
				name: "get-instruments-of-type",
				values: [instrumentTypeId]
			};

			app.client.query(getInstrumentsQuery).on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within DatabaseFunctions getInsts: ", err);
					response.send(res);
				}
			}).on('row', function(row) {
				//Add instruments to array
				res.instruments.push(row);
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					response.send(res);
				}
			});
		} else {
			res.error = 'Regex is broken or we are being hacked.'
			response.send(res);
		}
	});

	/*
	Gets all the teachers qualified for a specific instrument and language
	Parameters: instId = ID of the instrument type requested
				langId = ID of the language requested
	Returns: 	List of teachers qualified
	*/
	app.get('/database/getTeachers', function(request, response){
		var instrumentTypeId = request.query.instId;
		var languageId = request.query.langId;
		//setup response frame
		var res = {
			valid: false,
			teachers: [],
			error: ''
		};

		//Validate param (stop Injection attacks)
		res.valid = validateGeneral(instrumentTypeId) && validateGeneral(languageId);
		
		if(res.valid) {
			var getTeacherQuery;
			
			getTeacherQuery = {
				text: "SELECT t.id, t.first_name, t.last_name, te.grade "
					 +"FROM music_school.teachers t, music_school.teacher_languages tl, music_school.teacher_experience te "
					 +"WHERE  t.id = tl.teacher_id"
					 +"   AND t.id = te.teacher_id"
					 +"   AND te.inst_type_id = $1"
					 +"   AND te.grade >= 4" //4 is the "teaching" requirement
					 +"   AND tl.language_id = $2"
					 +"   AND t.is_terminated = FALSE"
					 +" ORDER BY grade DESC, first_name ASC",
				name: "get-applicable-teachers",
				values: [
					instrumentTypeId,
					languageId
				]
			};

			app.client.query(getTeacherQuery).on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within DatabaseFunctions getTeachers:");
					console.log("Params: instTypeId = ", instrumentTypeId, " / languageId = ", languageId);
					console.log("query: \n", getTeacherQuery);
					console.log("\n",err);
					response.send(res);
				}
			}).on('row', function(row) {
				//Add instruments to array
				res.teachers.push(row);
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					response.send(res);
				}
			});
		} else {
			res.error = 'Regex is broken or we are being hacked.'
			response.send(res);
		}
	});

	/* Gets all Instrument Types and Languages */
	app.get('/database/getInstrumentTypesAndLanguages', function(request, response){
		//setup response frame
		var res = {
			valid: true,
			languagesList: [],
			instrumentTypes: [],
			error: ''
		};
		
		var getInstrumentTypesQuery = {
			text: "SELECT id, name FROM music_school.instrument_types",
			name: "get-instrument-type-list"
		};

		var getLanguages = {
			text: "SELECT id as id, language as name FROM music_school.languages",
			name: "get-language-list"
		};

		app.client.query(getInstrumentTypesQuery)
		.on('error', function(err) {
			/* Error Handling */
			if (!response.headersSent) {
				res.valid = false;
				res.error = 'An error has occured. Please try again later or contact an administrator';
				console.log("Errors Happened within DatabaseFunctions : getInstrumentTypesAndLanguages : Query 1 \n", err);
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
						res.error = 'An error has occured. Please try again later or contact an administrator';
						res.instrumentTypes = [];
						console.log("Errors Happened within DatabaseFunctions : getInstrumentTypesAndLanguages : Query 2 \n", err);
						response.send(res);
					}
				}).on('row', function(row) {
					//Add instrument types to array
					res.languagesList.push(row);
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
}

/* General Validation Function */
function validateGeneral(string) {
	var regexp = new RegExp("^[A-Za-z0-9 ]*$");
	if (regexp.test(string)) {
		return true;
	}
	return false;
}