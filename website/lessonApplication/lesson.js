function Lesson(instrumentType = '', hireType = '', instrumentId = '', duration = '', startTime = '', endTime = '', day = '', studentId = '', languageId = '', teacherId = '') {
	this.instrumentType = instrumentType;
	this.hireType = hireType;
	this.instrumentId = instrumentId;
	this.day = day;
	this.duration = duration;
	this.startTime = startTime;
	this.endTime = endTime;
	this.studentId = studentId;
	this.language = languageId;
	this.teacher = teacherId;
	this.emailInfo = {
		instrumentTypeDesc: '',
		instrumentName: 'BYO',
		teacherName: 'any'
	};
}