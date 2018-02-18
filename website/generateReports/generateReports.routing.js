var generateReportsRouting = [
	{
		path: 'all',
		component: app.ViewAllReportsComponent
	}
	, {
		path: 'individual/instrument-summary-report',
		component: app.InstrumentSummaryReportComponent
	}
	, {
		path: 'individual/lesson-summary-report',
		component: app.LessonSummaryReportComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];