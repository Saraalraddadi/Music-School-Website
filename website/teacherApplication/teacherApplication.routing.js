var teacherApplicationRouting = [
	{
		path: 'ApplyForm',
		component: app.ApplyFormComponent
	}
	, {
		path: 'Confirmation',
		component: app.ApplyConfirmationComponent
	}
	, {
		path: '',
		redirectTo: 'ApplyForm',
		pathMatch: 'full'
	}
];