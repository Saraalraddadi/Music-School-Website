var studentTTRouting = [
	{
		path: 'Timetable',
		component: app.StudentTimetableComponent
	}
	, {
		path: 'lesson/:id',
		component: app.LessonInfoComponent
	}
	, {
		path: '',
		redirectTo: 'Timetable',
		pathMatch: 'full'
	}
];