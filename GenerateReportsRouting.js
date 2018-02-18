exports.include = (app) => {
	require('./database.js');

	app.get('/management/reports/', function(request, response) {
		response.render('generateReports/index');
	});

	app.get('/management/generateReports/getReports/', function(request, response) {
		var reportsResult = [];
		var result = {
			status: true,
			reports: reportsResult
		}

		var getQuery = {
			text: "SELECT id, name, display_name as displayname FROM music_school.reports",
			name: "get-report-names",
			values: []
		}

		app.client.query(getQuery).on('row', function(row) {
			reportsResult.push(row);
		})
		.on('end', function() {
			if (!response.headersSent) {
				if (reportsResult.length > 0) {
					response.send(result);
				} else {
					result.status = false;
					result.error = 'There are no reports available';
					response.send(result);
				}
			}
		});
	});

	app.get('/management/generateReports/getIndividualReport/', function(request, response) {
		var reportName = request.query.name;
		var reportResult = [];
		var result = {
			status: true,
			report: reportResult
		}

		var query = {
			text: '',
			name: 'get-'+reportName,
			values: []
		};

		switch (reportName) {
			case 'instrument-summary-report':
				query.text = 'SELECT '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.instrument_hire '
									+'WHERE hire_status_id IN (2,6)'
								+') AS instrumenthires, '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.instrument_hire '
									+'WHERE hire_status_id IN (1,2,6)'
								+') AS hirerequests, '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.instrument_hire '
									+'WHERE hire_status_id IN (3)'
								+') AS rejectedrequests, '
								+'('
									+'SELECT it.name '
									+'FROM music_school.instrument_hire ih '
									+'LEFT JOIN music_school.instruments i '
										+'ON i.id = ih.instrument_id '
									+'LEFT JOIN music_school.instrument_types it '
										+'ON it.id = i.id '
									+'WHERE ih.hire_status_id IN (2, 6) '
									+'GROUP BY it.name '
									+'ORDER BY count(*) DESC '
									+'LIMIT 1 '
								+') AS mostpopular, '
								+'('
									+'SELECT it.name '
									+'FROM music_school.instrument_hire ih '
									+'LEFT JOIN music_school.instruments i '
										+'ON i.id = ih.instrument_id '
									+'LEFT JOIN music_school.instrument_types it '
										+'ON it.id = i.id '
									+'WHERE ih.hire_status_id IN (2, 6) '
									+'GROUP BY it.name '
									+'ORDER BY count(*) ASC '
									+'LIMIT 1 '
								+') AS leastpopular, '
								+'('
									+'SELECT \'$\'||sum(i.hire_fee) '
									+'FROM music_school.instrument_hire ih '
									+'LEFT JOIN music_school.instruments i '
										+'ON i.id = ih.instrument_id '
									+'WHERE ih.hire_status_id IN (2, 6) '
								+') AS totalincome '
							+'FROM music_school.instrument_hire';
				break;
			case 'lesson-summary-report':
				query.text = 'SELECT '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.lessons '
									+'WHERE request_status_id IN (2,7)'
								+') AS booked, '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.cancelled_lessons '
								+') AS cancelled, '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.lessons '
									+'WHERE request_status_id IN (3) '
										+'AND teacher_id IS NOT NULL'
								+') AS specificrejected, '
								+'('
									+'SELECT count(*) '
									+'FROM music_school.lessons '
									+'WHERE request_status_id IN (3) '
										+'AND teacher_id IS NULL'
								+') AS allrejected, '
								+'('
									+'SELECT it.name '
									+'FROM music_school.lessons l '
									+'LEFT JOIN music_school.instrument_types it '
										+'ON it.id = l.inst_type_id '
									+'WHERE l.request_status_id IN (2, 6) '
									+'GROUP BY it.name '
									+'ORDER BY count(*) DESC '
									+'LIMIT 1 '
								+') AS popularinstrument, '
								+'('
									+'SELECT lesson_day '
									+'FROM music_school.lessons '
									+'WHERE request_status_id IN (2, 6) '
									+'GROUP BY lesson_day '
									+'ORDER BY count(*) DESC '
									+'LIMIT 1 '
								+') AS popularday, '
								+'('
									+'SELECT round(avg(accept_date::date - request_date::date),2) '
									+'FROM music_school.lessons '
									+'WHERE accept_date IS NOT NULL '
								+') AS averagedays '
							+'FROM music_school.lessons';
				break;
		}

		if (query.text && query.text != '') {
			app.client.query(query).on('row', function(row) {
				if (row.popularday) {
					row.popularday = app.weekdays[row.popularday];
				}
				reportResult.push(row);
			})
			.on('end', function() {
				if (!response.headersSent) {
					if (reportResult.length > 0) {
						response.send(result);
					} else {
						result.status = false;
						result.error = 'Report requested did not return any data';
						response.send(result);
					}
				}
			});
		} else {
			result.status = false;
			result.error = 'Invalid report type selected';
			response.send(result);
		}

	});

	app.get('/management/reports/*', function(request, response) {
	  response.render('generateReports/index');
	});
}