/* Routing for Teacher Registration */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/register/teacher/', function(request, response) {
	  response.render('teacherRegistration/index');
	});

	/* Register Teacher */
	app.post('/register/teacher/', function(request, response) {
		// Get Post Data
		var teacher = request.body;

		//Set up error array
		var isValid = {
			firstName: 			true,
			middleName: 		true,
			lastName: 			true,
			birthday: 			true,
			address: 			true,
			phoneNumber: 		true,
			email: 				true,
			languages:			true,
			instrumentTypeIds: 	true,
			gender:				true,
			dbError: 			false,
			dbErrorMessage: 	''
		};

		//Set up response
		var valid = {
			status:false,
			errorArray:isValid
		};
		
		//Run validation
		if (validateAll(teacher, isValid)) {
			valid.status = true;
		} else {
			valid.status = false;
			valid.errorArray = isValid;
			response.send(valid);
		}

		if(valid.status) {
			//Hash password
			var d = new Date();
			var n = d.getTime();

			teacher.password = Math.random().toString(36).substring(2,8); //Gen Here
			var saltedPassword = teacher.password + 'teacher'.HashCode() + n;
			var hashedPassword = saltedPassword.HashCode();

			//setup Queries
			var checkEmail = {
				text: "SELECT 1 FROM music_school.teachers WHERE email = $1",
				name: "check-teacher-email",
				values: [teacher.email]
			};

			var passwordCols = "salt, password"
			var newTeacherPasswordQuery = {
				text: "INSERT INTO music_school.passwords("+passwordCols+") VALUES("
					 	+"$1,$2"
					 +")",
				name: "create-new-teacher-password",
				values: [	
					  n
					, hashedPassword
				]
			};

			var teacherCols = "first_name, middle_name, last_name, dob, address, phone_no, email, password_id, is_terminated, date_employed, staff_description, gender"
			var newTeacherQuery = {
				text: "INSERT INTO music_school.teachers("+teacherCols+") VALUES("
						+"$1,$2,$3,"
						+"to_date($4, 'DD MM YYYY'),$5,$6,$7,"
						+"(SELECT MAX(id) FROM music_school.passwords),"
						+"FALSE,"
						+"now(),$8,$9"
					 +")",
				name: "create-new-teacher",
				values: [
					  teacher.firstName
					, teacher.middleName
					, teacher.lastName
					, teacher.birthday
					, teacher.address
					, teacher.phoneNumber
					, teacher.email
					, teacher.description.escapeHtml()
					, teacher.gender
				]
			};

			var experienceColumns = "teacher_id, inst_type_id, grade"
			var experienceText = "INSERT INTO music_school.teacher_experience("+experienceColumns+") VALUES";
			var experienceValues = [];
			var counter = 1;
			for(var i = 0; i < teacher.instrumentTypeIds.length; i++) {
				var instrumentInsert = '';
				if(i != 0) {
					instrumentInsert += ',';	
				}
				instrumentInsert += "((SELECT MAX(ID) FROM music_school.teachers), $"+ counter++ +", $"+ counter++ +")";
				experienceValues.push(teacher.instrumentTypeIds[i]);
				experienceValues.push(teacher.instrumentTypeGrades[i]);
				experienceText += instrumentInsert;
			}

			var languageColumns = "teacher_id, language_id"
			var languagesText = "INSERT INTO music_school.teacher_languages("+languageColumns+") VALUES";
			var languageValues = [];
			counter = 1;
			for(var i = 0; i < teacher.languages.length; i++) {
				var languageText = '';
				if(i != 0) {
					languageText += ',';	
				}
				languageText += "((SELECT MAX(ID) FROM music_school.teachers), $"+ counter++ +")";
				languageValues.push(teacher.languages[i]);
				languagesText += languageText;
			}

			//Run Queries
			app.client.query(checkEmail)
			.on('error', function(err) {
				if (!response.headersSent) {
					valid.status = false;
					isValid.dbError = true;
					isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
					response.send(valid);
					console.log("Error occured in TchrReg: ", err);
				}
			})
			.on('row', function(row) {
				if (!response.headersSent) {
					valid.status = false;
					isValid.dbError = true;
					isValid.dbErrorMessage = 'Email is already in use. Please enter a new email.';
					response.send(valid);
				}
			})
			.on('end', function(){
				app.client.query(newTeacherPasswordQuery)
				.on('error', function(err) {
					if (!response.headersSent) {
						valid.status = false;
						isValid.dbError = true;
						isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
						response.send(valid);
						console.log("Error occured in TchrReg: ", err);
					}
				})
				.on('end', function(){
					app.client.query(newTeacherQuery)
					.on('error', function(err) {
						if (!response.headersSent) {
							valid.status = false;
							isValid.dbError = true;
							isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
							response.send(valid);
							console.log("Error occured in TchrReg: ", err);
						}
					})
					.on('end', function(){
						app.client.query(experienceText, experienceValues)
						.on('error', function(err) {
							if (!response.headersSent) {
								valid.status = false;
								isValid.dbError = true;
								isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
								response.send(valid);
								console.log("Error occured in TchrReg : Register : ExperienceQuery");
								console.log("\nQuery: \n", experienceText);
								console.log("\nValues: \n", experienceValues);
								console.log("\nError: \n", err);
							}
						})
						.on('end', function() {
							app.client.query(languagesText, languageValues)
							.on('error', function(err) {
								if (!response.headersSent) {
									valid.status = false;
									isValid.dbError = true;
									isValid.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
									response.send(valid);
									console.log("Error occured in TchrReg : Register : LanguagesQuery \n", err);
									console.log("\nQuery: \n", languagesText);
									console.log("\nValues: \n", languageValues);
									console.log("\nError: \n", err);
								}
							})
							.on('end', function() {
								if (!response.headersSent) {
									//Send Email
									var textMessage = "Dear " + teacher.firstName + " " + teacher.lastName + ", "
												 +"\n\nYou have been registered as a teacher for the School of Music."
												 +"\nYour Temprary password is: '" + teacher.password +"'."
												 +"\nWe hope you enjoy your employment with us."
												 +"\n\nRegards,"
												 +"\nSchool of Music Team";

									var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
																 .replace(new RegExp("$"), '</p>')
																 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
																 .replace(new RegExp("\n","g"), '</p><p>');

									var teacherConfirmationEmail = {
										from: '"School of Music Admin" <test@gmail.com>',
										to: teacher.email,
										subject: "New Teacher Account",
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
							});
						});
					});
				});
			});
		}
	});

	app.get('/register/teacher/*', function(request, response) {
	  response.render('teacherRegistration/index');
	});
}

String.prototype.HashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

String.prototype.escapeHtml = function() {
  var map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return this.replace(/[&<>"']/g, function(m) { return map[m]; });
}

function validateAll(teacher, isValid) {
	if (validateFirstName(teacher.firstName, isValid) &&
		validateMiddleName(teacher.middleName, isValid) &&
		validateLastName(teacher.lastName, isValid) &&
		validateBirthday(teacher.birthday, isValid) &&
		validateAddress(teacher.address, isValid) &&
		validatePhoneNumber(teacher.phoneNumber, isValid) &&
		validateLanguages(teacher.languages, isValid) &&
		validateInstrumentTypes(teacher.instrumentTypeIds, isValid) &&
		validateInstrumentGrades(teacher.instrumentTypeGrades, isValid) &&
		validateEmail(teacher.email, isValid)) {
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

function validateAddress(address, isValid) {
	var regexp = new RegExp("^[A-Za-z0-9\-,/. ]+$");
	if (regexp.test(address)) {
		return true;
	}
	isValid.address = false;
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

function validateEmail(email, isValid) {
	var regexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$|^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}\.[a-z]{2,3}$");
	if (regexp.test(email)) {
		return true;
	}
	isValid.email = false;
	return false;
}

function validateLanguages(languages, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	for(var i = 0; i < languages.length; i++) {
		if (!regexp.test(languages[i])) {
			isValid.languages = false;
			return false;
		}
	}
	
	return true;
}

function validateInstrumentTypes(instrumentTypes, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	for(var i = 0; i < instrumentTypes.length; i++) {
		if (!regexp.test(instrumentTypes[i])) {
			isValid.instrumentTypeIds = false;
			return false;
		}
	}
	
	return true;
}

function validateInstrumentGrades(instrumentGrades, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	for(var i = 0; i < instrumentGrades.length; i++) {
		if (!regexp.test(instrumentGrades[i])) {
			return false;
		}
	}

	return true;
}