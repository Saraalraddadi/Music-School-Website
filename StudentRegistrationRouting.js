/* Routing For Student Registration */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/register/student/', function(request, response) {
	  response.render('studentRegistration/index');
	});

	/* Register Student */
	app.post('/register/student/', function(request, response) {
		//Get Post Data
		var student = request.body;

		/* Setup error array */
		var isValid = {
			firstName:true,
			middleName:true,
			lastName:true,
			birthday:true,
			address:true,
			phoneNumber:true,
			email:true,
			password:true,
			gender:true,
			errorMessage: ''
		};

		/* Setup response */
		var valid = {
			status:false,
			errorArray:isValid
		};
		/* Run validation to stop attacks */
		if (validateAll(student, isValid)) {
			valid.status = true;
		} else {
			valid.status = false;
			valid.errorArray = isValid;
			response.send(valid);
		}

		if(valid.status) {
			/* Hash Password */
			var d = new Date();
			var n = d.getTime();

			var saltedPassword = student.password + "student".HashCode() + n;
			var hashedPassword = saltedPassword.HashCode();

			/* Setup Queries */
			var checkEmail = {
				text: "SELECT 1 FROM music_school.students WHERE email = $1",
				name: "check-student-email",
				values: [student.email]
			};

			var passwordCols = "salt, password"
			var newStudentPasswordQuery = {
				text: "INSERT INTO music_school.passwords("+passwordCols+") VALUES("
					 	+"$1,$2"
					 +")",
				name: "create-new-student-password",
				values: [	
					  n
					, hashedPassword
				]
			};

			var studentCols = "first_name, middle_name, last_name, dob, address, phone_no, email, password_id, is_dormant, date_registered, gender";
			var newStudentQuery = {
				text: "INSERT INTO music_school.students("+studentCols+") VALUES("
						+"$1,$2,$3,"
						+"to_date($4, 'DD MM YYYY'),$5,$6,$7,"
						+"(SELECT MAX(id) FROM music_school.passwords WHERE password = $8),$9,"
						+"to_date($10, 'Dy Mon DD YYYY'),$11"
					 +")",
				name: "create-new-student",
				values: [
					  student.firstName
					, student.middleName
					, student.lastName
					, student.birthday
					, student.address
					, student.phoneNumber
					, student.email
					, hashedPassword
					,"FALSE"
					,d.toDateString()
					, student.gender
				]
			};

			/* Run Queries */
			app.client.query(checkEmail)//Run Query One
			.on('error', function() {
				/* Error Handling */
				console.log("Errors in StndtRegRting 1: ", err);
				valid.status = false;
				isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
				response.send(valid);
			})
			.on('row', function(row) {
				/* Email already exists */
				if (!response.headersSent) {
					valid.status = false;
					isValid.errorMessage = 'Email is already in use. Please enter a new email.';
					response.send(valid);
				}
			})
			.on('end', function(){
				app.client.query(newStudentPasswordQuery) //Run Query 2
				.on('error', function(err) {
					/* Error Handling */
					if (!response.headersSent) {
						valid.status = false;
						isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
						response.send(valid);
					}
					console.log("Errors in StndtRegRting 2: ", err);
				})
				.on('end', function() {
					app.client.query(newStudentQuery) //Run Query 3
					.on('error', function(err) {
						/* Error Handling */
						if (!response.headersSent) {
							valid.status = false;
							isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
							response.send(valid);
						}
						console.log("Errors in StndtRegRting 3: ", err);
					})
					.on('end', function() {
						// Registration Successful
						if (!response.headersSent) {
							var textMessage = "Dear " + student.firstName + " " + student.lastName + ", "
										 +"\n\nYou have been registered as a student for the School of Music."
										 +"\nWe hope you enjoy your experience with us."
										 +"\n\nRegards,"
										 +"\nSchool of Music Team";

							var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
														 .replace(new RegExp("$"), '</p>')
														 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
														 .replace(new RegExp("\n","g"), '</p><p>');

							var managerConfirmationEmail = {
								from: '"School of Music Admin" <test@gmail.com>',
								to: student.email,
								subject: "New Student Account",
								text: textMessage,
								html: htmlMessage
							};

							app.transporter.sendMail(managerConfirmationEmail, function(error, info) {
								if(error) {
									console.log(error);
								}
							});

							response.send(valid);
						}
					});
				});
			});
		}
	});

	app.get('/register/student/*', function(request, response) {
	  response.render('studentRegistration/index');
	});
}

/* Validation Functions */
function validateAll(student, isValid) {
	if (validateFirstName(student.firstName, isValid) &&
		validateMiddleName(student.middleName, isValid) &&
		validateLastName(student.lastName, isValid) &&
		validateBirthday(student.birthday, isValid) &&
		validateAddress(student.address, isValid) &&
		validatePhoneNumber(student.phoneNumber, isValid) &&
		validateEmail(student.email, isValid) &&
		validatePassword(student.password, isValid)) {
		return true;
	}

	return false;
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
	var regexp = new RegExp("^[A-Za-z0-9, ]+$");
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

function validatePassword(password, isValid) {
	var regexp = new RegExp("^.{6,}$");
	if (regexp.test(password)) {
		return true;
	}
	isValid.password = false;
	return false;
}