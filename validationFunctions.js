/* Manages Instrument Return Routing */
exports.include = (app) => {
	app.validateId = function(id) {
		var regexp = new RegExp("^[1-9][0-9]*$");
		if (regexp.test(id)) {
			return true;
		}
		return false;
	}

	app.validateType = function(type) {
		var regexp = new RegExp("^student$|^teacher$|^manager$");
		if (regexp.test(type)) {
			return true;
		}
		return false;
	}

	app.validateName = function(name, optional) {
		optional = optional || false;
		var regexp;

		if (optional) {
			regexp = new RegExp("^([A-Za-z]([A-Za-z ]*[A-Za-z])?)?$");
		} else {
			regexp = new RegExp("^[A-Za-z]([A-Za-z ]*[A-Za-z])?$");
		}
		if (regexp.test(name)) {
			return true;
		}
		return false;
	}

	app.validateDate = function(date, fmt) {
		fmt = fmt || 'dmy';
		var regexp;
		if(fmt == 'dmy') {
			regexp = new RegExp("^([0-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/((19|20)[0-9]{2})$");
		} else if (fmt == 'ymd') {
			regexp = new RegExp("^((19|20)[0-9]{2})\/(0[1-9]|1[0-2])\/([0-2][0-9]|3[0-1])$");
		} else {
			return false;
		}

		if (regexp.test(date)) {
			return true;
		}
		return false;
	}

	app.validatePhone = function(number) {
		var regexp = new RegExp("^[0-9]{8}$|^04[0-9]{8}$");
		if(regexp.test(number)) {
			return true;
		}
		return false;
	}

	app.validateEmail = function(email) {
		var regexp = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$|^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}\.[a-z]{2,3}$");
		if (regexp.test(email)) {
			return true;
		}
		return false;
	}

	app.validateText = function(text) {
		var regexp = new RegExp("^[A-Za-z0-9,\. ]+$");
		if (regexp.test(text)) {
			return true;
		}
		return false;
	}

	app.validateGender = function(gender) {
		var regexp = new RegExp("^Male$|^Female$");
		if (regexp.test(gender)) {
			return true;
		}
		return false;
	}

	app.validatePassword = function(password) {
		var regexp = new RegExp("^.{6,}$");
		if (regexp.test(password)) {
			return true;
		}
		return false;
	}

	app.validateGrade = function(grade) {
		var regexp = new RegExp("^[1-7]$");
		if (regexp.test(grade)) {
			return true;
		}
		return false;
	}

	app.validatePrice = function(price) {
		var regexp = new RegExp("^[1-9][0-9]*(\.[0-9]{1,2})?$");
		if (regexp.test(price)) {
			return true;
		}
		return false;
	}
}