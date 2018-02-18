var deactivateTeachersRouting = [
	{
		path: 'all',
		component: app.ViewAllTeachersComponent
	}
	, {
		path: 'individual/:id',
		component: app.ViewIndividualTeacherComponent
	}
	, {
		path: 'individual',
		component: app.ViewIndividualTeacherComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];