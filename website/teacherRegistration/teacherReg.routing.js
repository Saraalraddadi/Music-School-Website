var teacherRegRouting = [
	{
		path: 'RegisterForm',
		component: app.RegisterFormComponent
	}
	, {
		path: 'Confirmation',
		component: app.RegisterConfirmationComponent
	}
	, {
		path: '',
		redirectTo: 'RegisterForm',
		pathMatch: 'full'
	}
];