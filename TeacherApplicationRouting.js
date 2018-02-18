/* Routing for Teacher Application */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/apply/teacher/', function(request, response) {
	  response.render('teacherApplication/index');
	});

	/* Teacher Application */
	app.post('/apply/teacher/', function(request, response) {
		// Get Post Data
		var teacherApplication = request.body;

		//Set up error array
		var isValid = {
			firstName:true,
			middleName:true,
			lastName:true,
			birthday:true,
			phoneNumber:true,
			gender:true,
			coverLetter:true,
			instruments:true,
			languages:true,
			reference1name:true,
			reference1number:true,
			reference2name:true,
			reference2number:true,
			reference3name:true,
			reference3number:true,
			hours:true,
			email:true,
			dbError:false,
			dbErrorMessage:''
		};

		//Set up response
		var valid = {
			status:false,
			errorArray:isValid
		};
		
		//Run validation
		if (validateAll(teacherApplication, isValid)) {
			valid.status = true;
		} else {
			valid.status = false;
			valid.errorArray = isValid;
			response.send(valid);
		}

		if(valid.status) {

			var instrumentDetails = [];
			var instrumentDetailPairsArray = teacherApplication.instruments.split(";");
			var index = 0;
			for (var i = 0; i < instrumentDetailPairsArray.length; i++) {
				var name = instrumentDetailPairsArray[i].split(",")[0];
				var grade = instrumentDetailPairsArray[i].split(",")[1];
				if (name && name != ' ' && grade) {
					instrumentDetails[index] = name;
					instrumentDetails[index + 1] = grade;
					index += 2;
				}
			}

			var teacherApplicantsCols = "first_name, last_name, dob, gender ,phone_no, email, cover_letter, date_applied, status_id, is_shortlisted, is_approved, hours";
			var newTeacherApplicantQuery = {
				text: "INSERT INTO music_school.teacher_applicants("+teacherApplicantsCols+") VALUES("
						+"$1,$2"
						+",to_date($3, 'DD MM YYYY'), $4"
						+",$5,$6,$7,now(),"
						+"1,FALSE,FALSE,$8"
					 +")",
				name: "create-new-teacher-applicant",
				values: [
					  teacherApplication.firstName
					, teacherApplication.lastName
					, teacherApplication.birthday
					, teacherApplication.gender
					, teacherApplication.phoneNumber
					, teacherApplication.email
					, teacherApplication.coverLetter
					, teacherApplication.hours
				]
			};

			var referencesColumns = "teacher_applicant_id, name, phone_number";
			var referencesText = "INSERT INTO music_school.teacher_applicant_references("+referencesColumns+") VALUES";
			var referencesValues = [];
			var counter = 1;
			// reference 1
			var referencesInsert = '';
			referencesInsert += "((SELECT MAX(ID) FROM music_school.teacher_applicants), $"+ counter++ +", $"+ counter++ +")";
			referencesValues.push(teacherApplication.reference1name);
			referencesValues.push(teacherApplication.reference1number);
			referencesText += referencesInsert;
			// reference 2
			if (teacherApplication.reference2name != '' && teacherApplication.reference2number != '') {
				referencesInsert = ',';
				referencesInsert += "((SELECT MAX(ID) FROM music_school.teacher_applicants), $"+ counter++ +", $"+ counter++ +")";
				referencesValues.push(teacherApplication.reference2name);
				referencesValues.push(teacherApplication.reference2number);
				referencesText += referencesInsert;
			}
			// reference 3
			if (teacherApplication.reference3name != '' && teacherApplication.reference3number != '') {
				referencesInsert = ',';
				referencesInsert += "((SELECT MAX(ID) FROM music_school.teacher_applicants), $"+ counter++ +", $"+ counter++ +")";
				referencesValues.push(teacherApplication.reference3name);
				referencesValues.push(teacherApplication.reference3number);
				referencesText += referencesInsert;
			}

			var experienceColumns = "teacher_applicant_id, instrument, grade";
			var experienceText = "INSERT INTO music_school.teacher_applicant_experience("+experienceColumns+") VALUES";
			var experienceValues = [];
			var counter = 1;
			var instrumentInsert;
			for(var i = 0; i < instrumentDetails.length; i+=2) {
				instrumentInsert = '';
				if(i != 0) {
					instrumentInsert += ','; 
				}
				instrumentInsert += "((SELECT MAX(ID) FROM music_school.teacher_applicants), $"+ counter++ +", $"+ counter++ +")";
				experienceValues.push(instrumentDetails[i]);
				experienceValues.push(instrumentDetails[i+1]);
				experienceText += instrumentInsert;
			}

			var languageColumns = "applicant_id, language_id";
			var languageText = "INSERT INTO music_school.teacher_applicant_languages("+languageColumns+") VALUES";
			var languageValues = [];
			var counter = 1;
			for(var i = 0; i < teacherApplication.languages.length; i++) {
				var languageInsert = '';
				if(i != 0) {
					languageInsert += ','; 
				}
				languageInsert += "((SELECT MAX(ID) FROM music_school.teacher_applicants), $"+ counter++ +")";
				languageValues.push(teacherApplication.languages[i]);
				languageText += languageInsert;
			}

			//Run Queries
			app.client.query(newTeacherApplicantQuery)
			.on('error', function(err) {
				if (!response.headersSent) {
					valid.status = false;
					isValid.dbError = true;
					isValid.dbErrorMessage = 'Email already in use. If you believe this is incorrect and the issue persists, contact an administrator.';
					response.send(valid);
					console.log("Error occured in TeacherApplication: ", err);
				}
			})
			.on('end', function() {
				app.client.query(experienceText, experienceValues)
				.on('error', function(err) {
					if (!response.headersSent) {
						valid.status = false;
						isValid.dbError = true;
						isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
						response.send(valid);
						console.log("Error occured in TeacherApplication: ", err);
					}
				})
				.on('end', function() {
					app.client.query(languageText, languageValues)
					.on('error', function(err) {
						if (!response.headersSent) {
							valid.status = false;
							isValid.dbError = true;
							isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
							response.send(valid);
							console.log("Error occured in TeacherApplication: ", err);
						}
					})
					.on('end', function() {
						app.client.query(referencesText, referencesValues)
						.on('error', function(err) {
							if (!response.headersSent) {
								valid.status = false;
								isValid.dbError = true;
								isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
								response.send(valid);
								console.log("Error occured in TeacherApplication: ", err);
							}
						})
						.on('end', function() {
							if (!response.headersSent) {
								//Send Email
								var textMessage = "Dear " + teacherApplication.firstName + " " + teacherApplication.lastName + ", "
											 +"\n\nYou have successfully applied to be a teacher at the School of Music."
											 +"\nYou will be updated on the status of your application via email, and will be called if you have been selected for an interview."
											 +"\nThank you for your interest."
											 +"\n\nRegards,"
											 +"\nSchool of Music Team";

								var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
															 .replace(new RegExp("$"), '</p>')
															 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
															 .replace(new RegExp("\n","g"), '</p><p>');

								var teacherConfirmationEmail = {
									from: '"School of Music Admin" <test@gmail.com>',
									to: teacherApplication.email,
									subject: "Successful Teacher Application",
									text: textMessage,
									html: htmlMessage
								};

								app.transporter.sendMail(teacherConfirmationEmail, function(error, info) {
									if(error) {
										console.log(error);
									}
								});

								response.send(valid);
							}
						})
					})
				})
				
			});
		}
	});

	app.get('/database/getLanguages/', function(request, response) {
		var getLanguages = {
			text: "SELECT id, language as name FROM music_school.languages;",
			name: "get-language-list"
		}

		var responseObject = {
			languagesList: [],
			valid: true,
			error: ''
		}

		app.client.query(getLanguages)
			.on('error', function(err) {
				if (!response.headersSent) {
					responseObject.status = false;
					responseObject.error = 'An error has occured. Please try again later or contact an administrator';
					response.send(responseObject);
					console.log("Error occured in TeacherApplication: ", err);
				}
			})
			.on('row', function(row) {
				responseObject.languagesList.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					response.send(responseObject);
				}
			})
	});

	app.get('/apply/teacher/*', function(request, response) {
	  response.render('teacherApplication/index');
	});
}

function validateAll(teacherApplication, isValid) {
	if (validateFirstName(teacherApplication.firstName, isValid) &&
		validateMiddleName(teacherApplication.middleName, isValid) &&
		validateLastName(teacherApplication.lastName, isValid) &&
		validateBirthday(teacherApplication.birthday, isValid) &&
		validatePhoneNumber(teacherApplication.phoneNumber, isValid) &&
		validateCoverLetter(teacherApplication.coverLetter, isValid) &&
		validateInstruments(teacherApplication.instruments, isValid) &&
		validateLanguages(teacherApplication.languages, isValid) &&
		validateReferences(teacherApplication, isValid) &&
		validateHours(teacherApplication.hours, isValid) &&
		validateGender(teacherApplication.gender, isValid) &&
		validateEmail(teacherApplication.email, isValid)) {
		return true;
	} else {
		return false;
	}
}

function validateFirstName(firstName, isValid) {
	var regexp = new RegExp("^[A-Za-z ]+$");
	if (regexp.test(firstName)) {
		return true;
	}
	isValid.firstName = false;
	return false;
}

function validateMiddleName(middleName, isValid) {
	var regexp = new RegExp("^[A-Za-z ]*$");
	if (regexp.test(middleName)) {
		return true;
	}
	isValid.middleName = false;
	return false;
}

function validateLastName(lastName, isValid) {
	var regexp = new RegExp("^[A-Za-z ]+$");
	if (regexp.test(lastName)) {
		return true;
	}
	isValid.lastName = false;
	return false;
}

function validateBirthday(birthday, isValid) {
	var regexp = "^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)[0-9]{2})$";
	var days, months, years;
	if (birthday.match(regexp)) {
		return true;
	}
	isValid.birthday = false;
	return false;
}	

function validatePhoneNumber(phoneNumber, isValid) {
	var regexp = new RegExp("^[0-9]{8}$|^04[0-9]{8}$");
	if (regexp.test(phoneNumber)) {
		return true;
	}
	isValid.phoneNumber = false;
	return false;
}

function validateGender(gender, isValid) {
	var regexp = new RegExp("^[Mm]ale$|^[Ff]emale$");
	if (regexp.test(gender)) {
		return true;
	}
	isValid.gender = false;
	return false;
}

function validateCoverLetter(coverLetter, isValid) {
	var regexp = new RegExp("^[A-Za-z]([A-Za-z0-9 '?,._%+-]|\n|\r)+$");
	if (regexp.test(coverLetter)) {
		return true;
	}
	isValid.coverLetter = false;
	return false;
}

function validateInstruments(instruments, isValid) {
	var regexp = new RegExp("^([A-Za-z ]+,[ ]?[0-9];)+$");
	if (regexp.test(instruments)) {
		return true;
	}
	isValid.instruments = false;
	return false;
}

function validateLanguages(languages, isValid) {
	var regexp = new RegExp("^[1-9][0-9]*$");
	for (var i = 0; i < languages.length; i++) {
		if (!regexp.test(languages[i])) {
			isValid.languages = false;
			return false;
		}
	}
	return true;
}

function validateReferences(teacherApplication, isValid) {
	var valid = true;
	if (!validateReferenceName(teacherApplication.reference1name)) {
		isValid.reference1name = false;
		valid = false;
	}
	if (!validateReferenceNumber(teacherApplication.reference1number)) {
		isValid.reference1number = false;
		valid = false;
	}
	if (teacherApplication.reference2name != '' && teacherApplication.reference2number != '') {
		if (!validateReferenceName(teacherApplication.reference2name)) {
			isValid.reference2name = false;
			valid = false;
		}
		if (!validateReferenceNumber(teacherApplication.reference2number)) {
			isValid.reference2number = false;
			valid = false;
		}
	}
	if (teacherApplication.reference3name != '' && teacherApplication.reference3number != '') {
		if (!validateReferenceName(teacherApplication.reference3name)) {
			isValid.reference3name = false;
			valid = false;
		}
		if (!validateReferenceNumber(teacherApplication.reference3number)) {
			isValid.reference3number = false;
			valid = false;
		}
	}
	return valid;
}

function validateHours(hours, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	if (regexp.test(hours)) {
		return true;
	}
	isValid.hours = false;
	return false;
}

function validateEmail(email, isValid) {
	var regexp = new RegExp("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[a-z]{2,3}$|^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}\.[A-Za-z]{2,3}$");
	if (regexp.test(email)) {
		return true;
	}
	isValid.email = false;
	return false;
}

function validateReferenceName(name) {
	var regexpName = new RegExp("^[A-Za-z ]+$");
	if (regexpName.test(name)) {
		return true;
	} else {
		return false;
	}
}

function validateReferenceNumber(number) {
	var regexpNumber = new RegExp("^[0-9]{8}$|^04[0-9]{8}$");
	if (regexpNumber.test(number)) {
		return true;
	} else {
		return false;
	}
}