exports.include = (app) => {
	app.get('/ourPeople/', function(request, response) {
	  response.render('ourPeopleInformation/index');
	});
}