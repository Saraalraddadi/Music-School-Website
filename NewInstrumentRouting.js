/* Routing for new instruments Page */
exports.include = (app) => {
	require('./database.js');

	/* Display Page */
	app.get('/management/instrument/new', function(request, response) {
	  response.render('newInstrument/index');
	});

	/* Register Instrument */
	app.post('/management/instrument/new', function(request, response) {
		var instrument = request.body;
		/* Setup error Array */
		var isValid = {
			type:true,
			newInstType:true,
			condition:true,
			serialNumber:true,
			model:true,
			purchasePrice:true,
			hireFee:true,
			purchaseDate:true,
			description:true,
			errorMessage: ''
		};

		/* Setup Response */
		var valid = {
			status:false,
			errorArray:isValid
		};

		/* Run validation functions */
		if (validateAll(instrument, isValid)) {
			valid.status = true;
		} else {
			valid.status = false;
			valid.errorArray = isValid;
			response.send(valid);
		}

		/* If Valid */
		if(valid.status) {
			var instrumentColumns = "inst_type_id, serial_no, condition_id, model, purchase_date, purchase_price, inst_notes, hire_fee, is_sold_or_disposed";
			var newInstrumentQuery = "INSERT INTO music_school.instruments("+instrumentColumns+") VALUES("
						+"$1,$2,$3,$4,"+
						"to_date($5, 'DD MM YYYY'),$6,$7,$8,$9"
					 +")";
			if(instrument.type == 0) {
				var newInstrumentType = {
					text: "INSERT INTO music_school.instrument_types(name, lesson_fee) VALUES("
							+"$1,$2"
						 +") RETURNING id",
					name: "create-new-instrument-type",
					values: [
						  instrument.newInstType
						, 30
					]
				}

				var newTypeId;

				app.client.query(newInstrumentType)
				.on('error', function(err) {
					/* Error Handling */
					if (!response.headersSent) {
						valid.status = false;
						isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
						response.send(valid);
						console.log('error in NewInstrumentRouting: ', err);
					}
				})
				.on('row', function(row) {
					newTypeId = row.id;
				})
				.on('end', function() {
					if(newTypeId) {
						app.client.query(newInstrumentQuery, [
								  newTypeId
								, instrument.serialNumber
								, instrument.condition
								, instrument.model
								, instrument.purchaseDate
								, instrument.purchasePrice.substring(1)
								, instrument.description
								, instrument.hireFee.substring(1)
								,"FALSE"
							]
						)
						.on('error', function(err) {
							/* Error Handling */
							if (!response.headersSent) {
								valid.status = false;
								isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
								if(err.constraint == 'inst_serial_no_uq') {
									isValid.serialNumber = false;
									isValid.errorMessage = 'Serial Number Already Exists.';
								}
								response.send(valid);
								console.log('error in NewInstrumentRouting: ', err);
							}
						})
						.on('end', function() {
							//Insert successful: send response
							if (!response.headersSent) {
								response.send(valid);
							}
						});
					} else {
						/* Error Handling */
						if (!response.headersSent) {
							valid.status = false;
							isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
							response.send(valid);
							console.log('error in NewInstrumentRouting: ', err);
						}
					}
				});
			} else {
				app.client.query(newInstrumentQuery, [
						  instrument.type
						, instrument.serialNumber
						, instrument.condition
						, instrument.model
						, instrument.purchaseDate
						, instrument.purchasePrice.substring(1)
						, instrument.description
						, instrument.hireFee.substring(1)
						,"FALSE"
					]
				)
				.on('error', function(err) {
					/* Error Handling */
					if (!response.headersSent) {
						valid.status = false;
						isValid.errorMessage = 'An error has occured. Please try again later or contact an administrator';
						if(err.constraint == 'inst_serial_no_uq') {
							isValid.serialNumber = false;
							isValid.errorMessage = 'Serial Number Already Exists.';
						}
						response.send(valid);
						console.log('error in NewInstrumentRouting: ', err);
					}
				})
				.on('end', function() {
					//Insert successful: send response
					if (!response.headersSent) {
						response.send(valid);
					}
				});
			}
		}
	});

	app.get('/management/instrument/new/*', function(request, response) {
	  response.render('newInstrument/index');
	});
}

/* Validation Functions */
function validateAll(instrument, isValid) {
	if (validateType(instrument.type, isValid) &&
		validateCondition(instrument.condition, isValid) &&
		validateSerialNumber(instrument.serialNumber, isValid) &&
		validatePurchasePrice(instrument.purchasePrice, isValid) &&
		validateHireFee(instrument.hireFee, isValid) &&
		validatePurchaseDate(instrument.purchaseDate, isValid) &&
		validateDescription(instrument.description, isValid)) {
		if(instrument.type == 0) {
			if(validateNewInstType(instrument.newInstType, isValid)){
				return true;
			}
		} else {
			return true;
		}
	}

	return false;
}

function validateType(type, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	if (regexp.test(type)) {
		return true;
	}
	isValid.type = false;
	return false;
}

function validateNewInstType(newInstType, isValid) {
	var regexp = new RegExp("^[A-Za-z ]+$");
	if (regexp.test(newInstType)) {
		return true;
	}
	isValid.newInstType = false;
	return false;
}

function validateCondition(condition, isValid) {
	var regexp = new RegExp("^[0-9]+$");
	if (regexp.test(condition)) {
		return true;
	}
	isValid.condition = false;
	return false;
}

function validateSerialNumber(serialNumber, isValid) {
	var regexp = new RegExp("^[A-Z0-9]+$");
	if (regexp.test(serialNumber)) {
		return true;
	}
	isValid.serialNumber = false;
	return false;
}

function validateModel(model, isValid) {
	var regexp = new RegExp("^[A-Za-z0-9 ]+$");
	if (regexp.test(model)) {
		return true;
	}
	isValid.model = false;
	return false;
}

function validatePurchaseDate(purchaseDate, isValid) {
	var regexp = "^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)[0-9]{2})$";
	var days, months, years;
	if (purchaseDate.match(regexp)) {
		return true;
	}
	isValid.purchaseDate = false;
	return false;
}	

function validateHireFee(hireFee, isValid) {
	var regexp = new RegExp("^.[0-9]+(.[0-9]{2})?$");
	if (regexp.test(hireFee)) {
		return true;
	}
	isValid.hireFee = false;
	return false;
}

function validatePurchasePrice(purchasePrice, isValid) {
	var regexp = new RegExp("^.[0-9]+(.[0-9]{2})?$");
	if (regexp.test(purchasePrice)) {
		return true;
	}
	isValid.purchasePrice = false;
	return false;
}

function validateDescription(description, isValid) {
	var regexp = new RegExp("^[A-Za-z0-9 ._%+-]*$");
	if (regexp.test(description)) {
		return true;
	}
	isValid.description = false;
	return false;
}