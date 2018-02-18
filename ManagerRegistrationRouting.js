/* Routing for Teacher Registration */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/register/manager/', function(request, response) {
	  response.render('managerRegistration/index');
	});

	/* Register manager */
	app.post('/register/manager/', function(request, response) {
		// Get Post Data
		var manager = request.body;

		//Set up error array
		var errArray = {
			firstName:true,
			middleName:true,
			lastName:true,
			birthday:true,
			address:true,
			phoneNumber:true,
			email:true,
			gender:true,
			dbError:false,
			dbErrorMessage:''
		};

		//Set up response
		var res = {
			valid:false,
			errorArray:errArray
		};
		
		//Run validation
		if (validateAll(manager, errArray)) {
			res.valid = true;
		} else {
			res.valid = false;
			res.errorArray = errArray;
			response.send(res);
		}

		if(res.valid) {
			//Hash password
			var d = new Date();
			var n = d.getTime();

			manager.password = Math.random().toString(36).substring(2,8); //Gen Here
			var saltedPassword = manager.password + 'manager'.HashCode() + n;
			var hashedPassword = saltedPassword.HashCode();

			//setup Queries
			var checkEmail = {
				text: "SELECT 1 FROM music_school.managers WHERE email = $1",
				name: "check-manager-email",
				values: [manager.email]
			};

			var passwordCols = "salt, password"
			var newTeacherPasswordQuery = {
				text: "INSERT INTO music_school.passwords("+passwordCols+") VALUES("
					 	+"$1,$2"
					 +")",
				name: "create-new-manager-password",
				values: [	
					  n
					, hashedPassword
				]
			};

			var teacherCols = "first_name, middle_name, last_name, dob, address, phone_no, email, password_id, is_terminated, date_employed, staff_description, gender"
			var newTeacherQuery = {
				text: "INSERT INTO music_school.managers("+teacherCols+") VALUES("
						+"$1,$2,$3,"
						+"to_date($4, 'DD MM YYYY'),$5,$6,$7,"
						+"(SELECT MAX(id) FROM music_school.passwords),"
						+"FALSE,"
						+"now(),$8,$9"
					 +")",
				name: "create-new-manager",
				values: [
					  manager.firstName
					, manager.middleName
					, manager.lastName
					, manager.birthday
					, manager.address
					, manager.phoneNumber
					, manager.email
					, manager.description.escapeHtml()
					, manager.gender
				]
			};

			//Run Queries
			app.client.query(checkEmail)
			.on('error', function(err) {
				if (!response.headersSent) {
					res.valid = false;
					errArray.dbError = true;
					errArray.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
					response.send(res);
					console.log("Error occured in MgrReg 1: ", err);
				}
			})
			.on('row', function(row) {
				if (!response.headersSent) {
					res.valid = false;
					errArray.dbError = true;
					errArray.dbErrorMessage = 'Email is already in use. Please enter a new email.';
					response.send(res);
				}
			})
			.on('end', function(){
				app.client.query(newTeacherPasswordQuery)
				.on('error', function(err) {
					if (!response.headersSent) {
						res.valid = false;
						errArray.dbError = true;
						errArray.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
						response.send(res);
						console.log("Error occured in MgrReg 2: ", err);
					}
				})
				.on('end', function(){
					app.client.query(newTeacherQuery)
					.on('error', function(err) {
						if (!response.headersSent) {
							res.valid = false;
							errArray.dbError = true;
							errArray.dbErrorMessage = 'An error has occured. Please try again later or contact an administrator';
							response.send(res);
							console.log("Error occured in MgrReg 3: ", err);
						}
					})
					.on('end', function(){
						if (!response.headersSent) {
							//Send Email
							var textMessage = "Dear " + manager.firstName + " " + manager.lastName + ", "
										 +"\n\nYou have been registered as a manager for the School of Music."
										 +"\nYour Temporary password is: '" + manager.password +"'."
										 +"\nWe hope you enjoy your employment with us."
										 +"\n\nRegards,"
										 +"\nSchool of Music Team";

							var htmlMessage = textMessage.replace(new RegExp("^"), '<p>')
														 .replace(new RegExp("$"), '</p>')
														 .replace(new RegExp("\n\n","g"), '</p><br/><p>')
														 .replace(new RegExp("\n","g"), '</p><p>');

							var managerConfirmationEmail = {
								from: '"School of Music Admin" <test@gmail.com>',
								to: manager.email,
								subject: "New Manager Account",
								text: textMessage,
								html: htmlMessage
							};

							app.transporter.sendMail(managerConfirmationEmail, function(error, info) {
								if(error) {
									console.log(error);
								}
							});

							response.send(res);
						}
					});
				});
			});
		}
	});

	app.get('/register/manager/*', function(request, response) {
	  response.render('managerRegistration/index');
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

function validateAll(manager, errArray) {
	if (validateFirstName(manager.firstName, errArray) &&
		validateMiddleName(manager.middleName, errArray) &&
		validateLastName(manager.lastName, errArray) &&
		validateBirthday(manager.birthday, errArray) &&
		validateAddress(manager.address, errArray) &&
		validatePhoneNumber(manager.phoneNumber, errArray) &&
		validateEmail(manager.email, errArray)) {
		return true;
	} else {
		return false;
	}
}

function validateFirstName(firstName, errArray) {
	var regexp = new RegExp("^[A-Za-z ]+$");
	if (regexp.test(firstName)) {
		return true;
	}
	errArray.firstName = false;
	return false;
}

function validateMiddleName(middleName, errArray) {
	var regexp = new RegExp("^[A-Za-z ]*$");
	if (regexp.test(middleName)) {
		return true;
	}
	errArray.middleName = false;
	return false;
}

function validateLastName(lastName, errArray) {
	var regexp = new RegExp("^[A-Za-z ]+$");
	if (regexp.test(lastName)) {
		return true;
	}
	errArray.lastName = false;
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

function validateAddress(address, errArray) {
	var regexp = new RegExp("^[A-Za-z0-9\-,/. ]+$");
	if (regexp.test(address)) {
		return true;
	}
	errArray.address = false;
	return false;
}

function validatePhoneNumber(phoneNumber, errArray) {
	var regexp = new RegExp("^[0-9]{8}$|^04[0-9]{8}$");
	if (regexp.test(phoneNumber)) {
		return true;
	}
	errArray.phoneNumber = false;
	return false;
}

function validateEmail(email, errArray) {
	var regexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$|^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}\.[a-z]{2,3}$");
	if (regexp.test(email)) {
		return true;
	}
	errArray.email = false;
	return false;
}