var acceptStudentsRouting = [
	{
		path: 'all',
		component: app.ViewAllStudentsComponent
	}
	, {
		path: 'individual/:id',
		component: app.ViewIndividualStudentComponent
	}
	, {
		path: 'individual',
		component: app.ViewIndividualStudentComponent
	}
	, {
		path: '',
		redirectTo: 'all',
		pathMatch: 'full'
	}
];