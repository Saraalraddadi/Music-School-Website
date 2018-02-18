exports.include = (app) => {
	require('./database.js');

	app.get('/management/instruments/', function(request, response) {
		response.render('viewInstruments/index');
	});

	app.get('/management/instruments/getIndividualInstrument/', function(request, response) {
		var instrumentID = request.query.id;
		var instrument = [];
		var result = {
			status: true,
			instrument: instrument
		}

		if (!instrumentID) {
			result.status = false;
			response.send(result);
		} else {

			var getQuery = {
				text: "SELECT "
						+"i.id, "
						+"i.serial_no, "
						+"it.name as inst_type, "
						+"TO_CHAR(i.purchase_date,'DD/MM/YYYY') as purchase_date, "
						+"i.condition_id, "
						+"i.purchase_price, "
						+"i.model, "
						+"i.inst_notes, "
						+"i.hire_fee "
					+"FROM "
						+"music_school.instruments i "
						+"LEFT JOIN music_school.instrument_types it "
							+"ON inst_type_id = it.id "
					+"WHERE i.id = $1 "
					+"ORDER BY name ASC",
				name: "get-individual-instrument",
				values: [
					instrumentID
				]
			};

			app.client.query(getQuery).on('row', function(row) {
				instrument.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					if (instrument.length > 0) {
						response.send(result);
					} else {
						result.status = false;
						response.send(result);
					}
				}
			})
			.on('error', function(err) {
				console.log(err);
				result.status = false;
				response.send(result);
			});
		}
	});

	
	app.post('/management/instruments/updateInstrument/', function(request, response) {
		var instrument = request.body;

		var res = {
			valid: true,
			error: ''
		};

		if(instrumentIsValid(app, instrument)) {
			var counter = 1;
			var updateInstrumentQuery = "UPDATE music_school.instruments ";
			var updateInstrumentValues = [];
			Object.keys(instrument).forEach(function (key) {
				if(key != 'id') {
					if(counter == 1) {
						updateInstrumentQuery += "SET "
					} else {
						updateInstrumentQuery += ", "
					}
					if(key == 'purchase_date') {
						updateInstrumentQuery += key+"=to_date($"+ counter++ +",'DD/MM/YYYY') ";
					} else {
						updateInstrumentQuery += key+"=$"+ counter++ +" ";
					}
					updateInstrumentValues.push(instrument[key]);
				}
			});
			updateInstrumentQuery += "WHERE id=$" + counter++;
			updateInstrumentValues.push(instrument.id);

			app.client.query(updateInstrumentQuery, updateInstrumentValues)
			.on('error', function(err) {
				/* Error Handling */
				if (!response.headersSent) {
					res.valid = false;
					res.error = 'An error has occured. Please try again later or contact an administrator';
					console.log("Errors Happened within ViewInstrumentsRouting : updateInstrument");
					console.log("Params: instrument = ", instrument);
					console.log("query: \n", updateInstrumentQuery,"\n\n");
					console.log("values: \n", updateInstrumentValues,"\n\n");
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
			res.valid = false;
			res.error = 'Invalid input values';
			response.send(res);
		}
	});

	app.get('/management/instruments/getAllInstruments/', function(request, response) {
		var instrumentsResult = [];
		var result = {
			status: true,
			instruments: instrumentsResult
		}

		var getQuery = {
			text: "SELECT "
					+"i.id, "
					+"serial_no as serialNumber, "
					+"name as instType, "
					+"TO_CHAR(purchase_date,'DD/MM/YYYY') as purchaseDate, "
					+"condition, "
					+"purchase_price as price, "
					+"model, "
					+"hire_fee as hireFee "
				+"FROM "
					+"music_school.instruments i "
					+"LEFT JOIN music_school.instrument_types it "
						+"ON inst_type_id = it.id "
					+"LEFT JOIN music_school.conditions c "
						+"ON condition_id = c.id "
				+"WHERE is_sold_or_disposed = FALSE "
				+"ORDER BY name ASC",
			name: "get-instruments",
			values: []
		};

		app.client.query(getQuery)
		.on('row', function(row) {
			instrumentsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (instrumentsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					response.send(result);
				}
			}
		});
	});

	app.post('/management/instruments/getIndividualInstrument/delete/', function(request,response) {
		var instrumentID = request.body.id;
		var result = {
			status: true,
		};

		var deleteQuery = {
			text: "UPDATE music_school.instruments SET is_sold_or_disposed = TRUE WHERE id = $1",
			name: "delete-instrument",
			values: [
				instrumentID
			]
		}

		app.client.query(deleteQuery).on('error', function(err) {
			result.status = false;
			response.send(result);
		})
		.on('end', function() {
			if (!response.headersSent) {
				response.send(result);
			}
		})
	});

	app.get('/management/instruments/*', function(request, response) {
	  response.render('viewInstruments/index');
	});
}

function instrumentIsValid(app, instrument) {
	console.log(instrument);
	if(app.validateId(instrument.id) &&
	   app.validateText(instrument.model) &&
	   app.validateDate(instrument.purchase_date) &&
	   app.validatePrice(instrument.purchase_price) &&
	   app.validateId(instrument.condition_id) && //Optional = true
	   app.validatePrice(instrument.hire_fee) &&
	   app.validateText(instrument.serial_no) &&
	   app.validateText(instrument.inst_notes)) {
		return true;
	}

	return false;
}