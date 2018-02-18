var appRoutes = [
	{
		path: 'heroes',
		component: app.HeroComponent
	}
	, {
		path: 'dashboard',
		component: app.DashboardComponent
	}
	, {
		path: 'detail/:id',
		component: app.HeroDetailComponent
	}
	, {
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full'
	}
];