exports.include = (app) => {
	app.get('/contactUs/', function(request, response) {
	  response.render('contactUsInformation/index');
	});
}