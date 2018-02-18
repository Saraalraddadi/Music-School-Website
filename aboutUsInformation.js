exports.include = (app) => {
	app.get('/aboutUs/', function(request, response) {
	  response.render('aboutUsInformation/index');
	});
}