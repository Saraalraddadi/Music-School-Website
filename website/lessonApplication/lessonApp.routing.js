var lessonAppRouting = [
	{
		path: 'ApplicationForm',
		component: app.ApplicationFormComponent
	}
	, {
		path: 'Confirmation',
		component: app.LessonConfirmationComponent
	}, {
		path: '',
		redirectTo: 'ApplicationForm',
		pathMatch: 'full'
	}
];