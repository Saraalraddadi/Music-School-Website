var newInstrumentRouting = [
	{
		path: 'AddInstrumentForm',
		component: app.NewInstrumentFormComponent
	}
	, {
		path: 'Confirmation',
		component: app.NewInstrumentConfirmationComponent
	}
	, {
		path: '',
		redirectTo: 'AddInstrumentForm',
		pathMatch: 'full'
	}
];