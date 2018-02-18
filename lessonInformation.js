/* Routing for Lesson Information Page */
exports.include = (app) => {
	app.get('/information/', function(request, response) {
	  response.render('serviceInformation/index');
	});

	app.get('/information/getInstruments', function(request, response) {
	  	var instrumentsReturned = [];

		var result = {
			status: true,
			instruments: instrumentsReturned
		};

	  	var getQuery = "SELECT DISTINCT name, 30 AS fee FROM music_school.instrument_types;";

		app.client.query(getQuery).on('error', function(err) {
			if (!response.headersSent) {
				result.status = false;
				response.send(result);
			}
		})
		.on('row', function(row) {
			instrumentsReturned.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				response.send(result);
			}
		});
	});
}