/* Setup Node Modules */
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nodemailer = require('nodemailer');

/* Any global variables should go here */
app.weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* Global Function used to Hash Strings */
String.prototype.HashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/* Connect to Database and Gmail*/
require('./database.js').include(app);
app.transporter = nodemailer.createTransport('smtps://ifb299data55%40gmail.com:IFB299d55@smtp.gmail.com');


/* Setup Server Variables and connection to files  */
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/website'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));
app.set('views', __dirname + '/website');
app.set('view engine', 'ejs');

/* Setup Main Routing */
app.get('/', function(request, response) {
	response.render('main/index');
});

app.get('/dev', function(request, response) {
	response.render('dev-info/dev-info');
});

/* Link to Feature Routing */
require('./validationFunctions.js').include(app);
require('./database/databaseFunctions.js').include(app);
require('./loginRouting.js').include(app);
require('./MyPortalRouting.js').include(app);
require('./lessonInformation.js').include(app);
require('./StudentRegistrationRouting.js').include(app);
require('./TeacherRegistrationRouting.js').include(app);
require('./ManagerRegistrationRouting.js').include(app);
require('./StudentLessonApplicationRouting.js').include(app);
require('./NewInstrumentRouting.js').include(app);
require('./DeactivateTeachersRouting.js').include(app);
require('./ReturnInstrumentsRouting.js').include(app);
require('./AcceptStudentsRouting.js').include(app);
require('./BorrowedInstrumentInfoRouting.js').include(app);
require('./InstrumentHireRequestsRouting.js').include(app);
require('./aboutUsInformation.js').include(app);
require('./contactUsInformation.js').include(app);
require('./ourPeopleInformation.js').include(app);
require('./ViewTeacherApplicationsRouting.js').include(app);
require('./TeacherApplicationRouting.js').include(app);
require('./TeacherTimetablesRouting.js').include(app);
require('./StudentTimetablesRouting.js').include(app);
require('./ViewInstrumentsRouting.js').include(app);
require('./GenerateReportsRouting.js').include(app);

/* Setup 404 page */
app.use(function(request, response) {
	response.render('404');
});

/* Start Server */
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
