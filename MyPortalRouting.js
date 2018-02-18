exports.include = (app) => {
	require('./database.js');

	app.get('/myportal/', function(request, response) {
		response.render('myPortal/index');
	});

	app.post('/myportal/SavePersonalData', function(request, response) {
		var user = request.body;

		var res = {
			valid: true,
			error: ''
		};

		if(userIsValid(app, user)) {
			var counter = 1;
			var updateUserQuery = "UPDATE music_school." + user.type + "s ";
			var updateUserValues = [];
			Object.keys(user).forEach(function (key) {
				if(key != 'id' && key != 'type') {
					if(counter == 1) {
						updateUserQuery += "SET "
					} else {
						updateUserQuery += ", "
					}
					if(key == 'dob') {
						updateUserQuery += key+"=to_date($"+ counter++ +",'DD/MM/YYYY') ";
					} else {
						updateUserQuery += key+"=$"+ counter++ +" ";
					}
					updateUserValues.push(user[key]);
				}
			});
			updateUserQuery += "WHERE id=$" + counter++;
			updateUserValues.push(user.id);

			app.client.query(updateUserQuery, updateUserValues)
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within MyPortalRouting : SavePersonalData");
					console.log("Params: user = ", user);
					console.log("query: \n", updateUserQuery,"\n\n");
					console.log("values: \n", updateUserValues,"\n\n");
					console.log("error: \n", err,"\n\n");
					response.send(res);
				}
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					response.send(res);
				}
			});

		} else {
			res.valid = 'false';
			res.error = 'Invalid input values';
			response.send(res);
		}
	});

	app.post('/myportal/SavePasswordData', function(request, response) {
		var password = request.body;

		var res = {
			valid: true,
			error: ''
		};

		if(passwordIsValid(app, password)) {
			var checkOldPasswordQuery = {
				text: "SELECT p.salt, p.password from music_school." + password.type + "s u, music_school.passwords p "
					 +"WHERE u.password_id = p.id "
					 +"AND u.id=$1",
				name: "get-old-password",
				values: [password.id]
			};

			app.client.query(checkOldPasswordQuery)
			.on('error', function(err) {
				res.valid = false;
				res.error = 'The server is currently down. Try again later.';
				response.send(res);
				console.log("Error in MyPortalRouting : SavePasswordData : CheckOldPasswordQuery");
				console.log("Query:\n",checkOldPasswordQuery,"\n\n");
				console.log("Input:\n",password,"\n\n");
				console.log("error:\n",err,"\n\n");
			})
			.on('row', function(row) {
			    var inputPassSalted = password.old + password.type.HashCode() + row.salt;
				if (inputPassSalted.HashCode() == row.password) { //Passwords Match
					var d = new Date();
					var n = d.getTime();

					var saltedPassword = password.new + password.type.HashCode() + n;
					var hashedPassword = saltedPassword.HashCode();

					var passwordCols = "salt, password"
					var newPasswordQuery = "INSERT INTO music_school.passwords("+passwordCols+") VALUES("+n+", "+hashedPassword+"); "
										  +"UPDATE music_school."+password.type+"s SET password_id = ("
										  	+"SELECT MAX(id) FROM music_school.passwords"
										  +") WHERE id="+password.id+";"

					app.client.query(newPasswordQuery)
					.on('error', function(err) {
						/* Error Handling */
						if (!response.headersSent) {
							res.valid = false;
							res.error = 'The server is currently down. Try again later.';
							response.send(res);
							console.log("Error in MyPortalRouting : SavePasswordData : newPasswordQuery");
							console.log("Query:\n",newPasswordQuery,"\n\n");
							console.log("Input:\n",password,"\n\n");
						}
					})
					.on('end', function() {
						if (!response.headersSent) {
							response.send(res);
						}
					});
				} else {
					if (!response.headersSent) {
						res.valid = false;
						res.error = "Old password is incorrect.";
						response.send(res);
					}
				}
			})
		} else {
			res.valid = false;
			res.error = 'Invalid input values';
			response.send(res);
		}
	});

		app.post('/myportal/SaveProfessionalData', function(request, response) {
		var skills = request.body;

		var res = {
			valid: true,
			error: ''
		};

		if(skillsAreValid(app, skills)) {
			var experienceColumns = "teacher_id, inst_type_id, grade";
			var experienceText = "INSERT INTO music_school.teacher_experience("+experienceColumns+") VALUES";
			var experienceValues = [skills.id];
			var counter = 2;
			for(var i = 0; i < skills.instruments.length; i++) {
				var instrumentInsert = '';
				if(i != 0) {
					instrumentInsert += ',';	
				}
				instrumentInsert += "($1, $"+ counter++ +", $"+ counter++ +")";
				var id = skills.instruments[i]
				experienceValues.push(id);
				experienceValues.push(skills.grades[id - 1]);
				experienceText += instrumentInsert;
			}

			experienceText += " ON CONFLICT (teacher_id, inst_type_id) DO UPDATE SET grade = EXCLUDED.grade";

			var languageColumns = "teacher_id, language_id";
			var languageText = "INSERT INTO music_school.teacher_languages("+languageColumns+") VALUES";
			var languageValues = [skills.id];
			var counter = 2;
			for(var i = 0; i < skills.languages.length; i++) {
				var languageInsert = '';
				if(i != 0) {
					languageInsert += ',';	
				}
				languageInsert += "($1, $"+ counter++ +")";
				languageValues.push(skills.languages[i]);
				languageText += languageInsert;
			}

			languageText += " ON CONFLICT (teacher_id, language_id) DO NOTHING";

			app.client.query(experienceText, experienceValues)
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within MyPortalRouting : SaveProfessionalData : ExperienceUpdate");
					console.log("Params: skills = ", skills);
					console.log("query: \n", experienceText,"\n\n");
					console.log("values: \n", experienceValues,"\n\n");
					console.log("error: \n", err,"\n\n");
					response.send(res);
				}
			})
			.on('end', function() {
				//return response
				if (!response.headersSent) {
					app.client.query(languageText, languageValues)
					.on('error', function(err) {
						/* Error Handling */
						if (!response.headersSent) {
							res.valid = false;
							res.error = 'An error has occured. Please try again later or contact an administrator';
							console.log("Errors Happened within MyPortalRouting : SaveProfessionalData : LanguageUpdate");
							console.log("Params: skills = ", skills);
							console.log("query: \n", languageText,"\n\n");
							console.log("values: \n", languageValues,"\n\n");
							console.log("error: \n", err,"\n\n");
							response.send(res);
						}
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
			res.valid = 'false';
			res.error = 'Invalid input values';
			response.send(res);
		}
	});

	app.get('/myportal/*', function(request, response) {
	  response.render('myPortal/index');
	});
}

function userIsValid(app, user) {
	if(app.validateId(user.id) &&
	   app.validateType(user.type) &&
	   app.validateName(user.first_name) &&
	   app.validateName(user.middle_name, true) && //Optional = true
	   app.validateName(user.last_name) &&
	   app.validateEmail(user.email) &&
	   app.validateDate(user.dob) && //Format = ymd (year/month/day)
	   app.validateText(user.address) &&
	   app.validatePhone(user.phone_no) &&
	   app.validateGender(user.gender)) {
		return true;
	}

	return false;
}

function passwordIsValid(app, password) {
	if(app.validateId(password.id) &&
	   app.validateType(password.type) &&
	   app.validatePassword(password.old) &&
	   app.validatePassword(password.new)) {
		return true;
	}

	return false;
}

function skillsAreValid(app, skills) {
	if(!app.validateId(skills.id)) return false;
	for(index in skills.languages) {
		if(!app.validateId(skills.languages[index])) return false;
	}

	for(index in skills.instruments) {
		var id = skills.instruments[index];
		if(!app.validateId(id)) return false;
		if(!app.validateGrade(skills.grades[id - 1])) return false;
	}

	return true;

}