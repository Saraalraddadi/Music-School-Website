var instrumentHireRequestsRouting = [
	{
		path: 'all',
		component: app.ViewAllInstrumentHireRequestsComponent
	}
	, {
		path: 'individual/:id',
		component: app.ViewIndividualInstrumentHireRequestComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];