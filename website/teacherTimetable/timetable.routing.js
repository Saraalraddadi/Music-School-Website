var teacherTTRouting = [
	{
		path: 'Timetable',
		component: app.TeacherTimetableComponent
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