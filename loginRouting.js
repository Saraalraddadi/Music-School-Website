/* Manages Routing of the 3 login pages */
exports.include = (app) => {
	require('./database.js');

	app.get('/login/student/', function(request, response) {
	  response.render('studentLogin/index');
	});

	app.get('/login/teacher/', function(request, response) {
	  response.render('teacherLogin/index');
	});

	app.get('/login/manager/', function(request, response) {
	  response.render('managerLogin/index');

	});

	app.post('/login/student/', function(request, response) {
		var user = request.body;
		var loginQuery = GenerateStudentLoginQuery(user);
		var res = GetLoginResponse(response, loginQuery, user, "student");
	});

	app.post('/login/teacher/', function(request, response) {
		var user = request.body;
		var loginQuery = GenerateTeacherLoginQuery(user);
		var res = GetLoginResponse(response, loginQuery, user, "teacher");
	});

	app.post('/login/manager/', function(request, response) {
		var user = request.body;
		var loginQuery = GenerateManagerLoginQuery(user);
		var res = GetLoginResponse(response, loginQuery, user, "manager");
	});

	function GenerateStudentLoginQuery(user) {
		return {
			text: "SELECT u.id, u.first_name||' '||u.last_name as display_name, p.salt, p.password FROM music_school.students u, music_school.passwords p WHERE p.id = u.password_id AND u.email=$1",
			name: "student-login-query",
			values: [	
				user.email
			]
		};
	}

	function GenerateTeacherLoginQuery(user) {
		return {
			text: "SELECT u.id, u.first_name||' '||u.last_name as display_name, p.salt, p.password FROM music_school.teachers u, music_school.passwords p WHERE p.id = u.password_id AND u.email=$1 AND is_terminated = FALSE",
			name: "teacher-login-query",
			values: [	
				user.email
			]
		};
	}

	function GenerateManagerLoginQuery(user) {
		return {
			text: "SELECT u.id, u.first_name||' '||u.last_name as display_name, p.salt, p.password FROM music_school.managers u, music_school.passwords p WHERE p.id = u.password_id AND u.email=$1 AND is_terminated = FALSE",
			name: "manager-login-query",
			values: [	
				user.email
			]
		};
	}

	function GetLoginResponse(response, loginQuery, user, userType) {
		app.client.query(loginQuery)
		.on('row', function(row) {
		    var inputPassSalted = user.password + userType.HashCode() + row.salt;

			if (inputPassSalted.HashCode() == row.password) { //Passwords Match
				if (!response.headersSent) {
					userCookie = {
						valid: 'valid',
						user: {
							id: row.id,
							displayName: row.display_name,
							email: user.email,
							type: userType,
							validation: user.password.HashCode()
						}
					};
					response.send(userCookie);
				}
			} else { //Passwords Did not Match
				if (!response.headersSent) {
					var res = {
						valid: 'invalid',
						error: 'Incorrect Password'
					}
					response.send(res);
				}
			}
		})
		.on('end', function() { //End of Query. responses would have been sent if User existed.
			if (!response.headersSent) {
				var res = {
					valid: 'invalid',
					error: 'User does not exist'
				}
				response.send(res);
			}
		})
	}
}