var viewInstrumentsRouting = [
	{
		path: 'all',
		component: app.ViewAllInstrumentsComponent
	}
	, {
		path: 'individual/:id',
		component: app.ViewIndividualInstrumentComponent
	}
	, {
		path: 'individual',
		component: app.ViewIndividualInstrumentComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];