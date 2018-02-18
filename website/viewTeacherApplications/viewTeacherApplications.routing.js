var viewTeacherApplicationsRouting = [
	{
		path: 'all',
		component: app.ViewAllTeacherApplicationsComponent
	}
	, {
		path: 'individual/:id',
		component: app.ViewIndividualTeacherApplicationComponent
	}
	, {
		path: 'individual',
		component: app.ViewIndividualTeacherApplicationComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];