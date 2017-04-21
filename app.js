
/**
 * Module dependencies.
 */


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var express = require('express')
  /*, routes = require('./routes')
  , user = require('./routes/user')*/
  , routes = require('./app_server/routes/index')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , dataservice = require('./modules/dataservices')
  , messagedataservice = require('./modules/messagedataservice')
  , devicedataservice = require('./modules/devicedataservice')
  , schooldataservice = require('./modules/schooldataservice')
  , gcm =  require('node-gcm')
  , fs = require('fs');

var app = express();
var passport = require('passport');
var user = require('./app_api/models/users');
require('./app_api/models/school');
require('./app_api/models/teachers');
var Teacher = mongoose.model('Teacher');
var School= mongoose.model('School');
require('./app_api/config/passport');

var routesApi = require('./app_api/routes/index');

var cloudinary = require('cloudinary');

var xlsxtojson = require("xlsx-to-json-lc");
var xltojson = require("xls-to-json-lc");
var fileUpload = require('express-fileupload');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'app_client')));

app.set('views', path.join(__dirname, 'app_server', 'views'));
//app.use('/',routes);
app.use(passport.initialize());

app.use('/api', routesApi);

app.use(fileUpload());

cloudinary.config({ 
	  cloud_name: 'schoolsync', 
	  api_key: '388181157936776', 
	  api_secret: 'Dp6rilZ1xAYNy83mxi9XWOh_cCE' 
	});


// development only
if ('development' == app.get('env')) {
  //app.use(express.errorHandler());
}

var dbURI = 'mongodb://localhost/SchoolsDB';
if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGOLAB_URI;
}

console.log('Connecting to DB ' + dbURI);

mongoose.connect(dbURI);

var SubjectSchema = new mongoose.Schema({
     Subject: {type: String, required: true },
	 SubjectCode: String,
	 SchoolId: String
});

SubjectSchema.index({Subject:1, SchoolId:1},{unique: true});

var ClassSchema = new mongoose.Schema({
     Class: String,
	 Section: String,
	 ClassSection : {type: String, required: true},
	 SchoolId: String
});

ClassSchema.index({ClassSection:1, SchoolId:1},{unique: true});

var ParentTypeSchema = new mongoose.Schema({
	ParentType: String
});

var StudentSchema = new mongoose.Schema({
	StudentId: {type: String, required: true, unique: true },
	SchoolId: String,
	StudentFirstName: {type: String, required: true},
	StudentMiddleName: String,
	StudentLastName: {type: String, required: true},
	StudentDOB : Date,
	Age : {type:Number, min:2, max: 24},
	StudentGender: String,
	StudentClassStandard: String,
	StudentFullAddress: String,
	ImageUrl: String,
	StudentParentMobiles:
		[
		  Number
		],
	ParentList: [
		{
			ParentType: String,
			ParentFirstName: {type: String, required: true},
			ParentLastname: {type: String, required: true},
			MobileNumber: {type:Number ,required: true},
			AlternateMobNumber: Number,
			EmailId: String,
			AlternateEmailID: String,
			PresentAddress: String,
			PresentAddressPOBox: Number,
			PermanentAddress: String,
			PermanentAddressPOBox: Number,
			/*Messages:
			[
			 {
			 Message: String,
			 Delivered: Boolean
			 }
			]*/
			
		}	
	]
});


var MobileDeviceMappingSchema = new mongoose.Schema({
	MobileNumber: Number,
	DeviceId: String
});

var MessageSchema = new mongoose.Schema({
	
	From: 
		{
		  Type: String,
		  Id: String
		},
	Message:
		{
		  MessageBody: String,
		  MessageTitle: String
		},
	To:
		[
		  {
		    Type: String,
		    Id: String,
		    Mobile:Number,
		    ClassStandard: String
		  } 
		],
	
	DateofMsg: Date,
	DeliveredToAll: Boolean,
	DeliveredSuccessfullyTo:
		[
		 String
		],
	DeliveredFailedTo:
		[
		 String
		]
});

var LocalMessageSchema = new mongoose.Schema({

	type: String,
	body: String,
	title: String,
	date: String,
	notification_id: String,
	ImageUrl: String,
	FromType: String,
	FromName : String,
	FromId: String,
	ToIds:
		[
		  String
		 ],
		 MobileNumbers: [Number] ,
		 Error: String,
		 RespMessage: Object
});


var StudentTimeTableSchema = new mongoose.Schema({
	ClassStandard: {type: String, required: true, unique: true },
	SchoolId: String,
	Days: [
	       {
	    	   Day: String,
	TimeSlots: [
	   {
		   
	     StartTime: String,
	     EndTime: String,
	     PeriodNumber: String,
	     TeacherId: String,
	     TeacherName: String,
	     SubjectId: String,
	     SubjectName: String

	   }
	 ]
	      }
	]
	});

var TeacherTimeTableSchema = new mongoose.Schema({
    TeacherId:  {type: String, required: true, unique: true },
	SchoolId: String,
	Days: [
	              {
	             Day: String,	  
	TimeSlots: [
	   {
	     ClassStandard: String,
	     StartTime: String,
	     EndTime: String,
	     PeriodNumber: String,     
	     SubjectId: String,
	     SubjectName: String

	   }
	 ]
	              }]
	});

var EventsSchema = new mongoose.Schema({
	EventName : String,
	EventDate: Date,
	EventPlace: String,
	EventStartTime: String,
	EventEndTime: String,
	SchoolId: String,
	TeacherIdS: [ ],
	StudentIDS: [ ]
	});




var Student = mongoose.model('Student', StudentSchema);

var ParentType = mongoose.model('ParentType', ParentTypeSchema);

var Class = mongoose.model('Class', ClassSchema);

var Subject = mongoose.model('Subject', SubjectSchema);


var MobileDevice = mongoose.model('MobileDevice', MobileDeviceMappingSchema);

var Message = mongoose.model('Message', MessageSchema);

var StudentTimeTable = mongoose.model('StudentTimeTable', StudentTimeTableSchema);

var TeacherTimeTable = mongoose.model('TeacherTimeTable', TeacherTimeTableSchema);

var Events = mongoose.model('Events', EventsSchema);

var LocalMessageLogging = mongoose.model('LocalMessageLogging',LocalMessageSchema);

var staticnotificationid = 100000;

app.put('/Class', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createClass(Class, request.body, response);
	});
	

app.put('/Subject', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createSubject(Subject, request.body, response);
	});	
	
app.post('/Class', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateClass(Class, request.body, response);
	});
	

app.post('/Subject', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateSubject(Subject, request.body, response);
});	

app.get('/Class/:SchoolId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.getAllClass(Class, request.params.SchoolId, response);
});

app.get('/ClassByName', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.getClassByName(Class, request.param('Name'), request.param('SchoolId') , response);
});

app.get('/ClassByClassSection', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.getClassByClassSection(Class, request.param('ClassSection'), request.param('SchoolId'), response);
});

app.del('/ClassByClassSection', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.deleteClassByClassSection(Class, request.param('ClassSection'), request.param('SchoolId'), response);
});

app.get('/Subject/:SchoolId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.getAllSubject(Subject, request.params.SchoolId, response);
});	

app.get('/SubjectByName', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.getSubjectByName(Subject, request.param('Name'), request.param('SchoolId'), response);
});

app.del('/SubjectByName', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.deleteSubjectByName(Subject, request.param('Name'), request.param('SchoolId'), response);
});



app.get('/StudentTimeTable/:StudentId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.StudentId);
	dataservice.findStudentTimeTableByStudentId(StudentTimeTable, Student, request.params.StudentId,
	response);
	});

app.get('/StudentTimeTableForClassStandard/:ClassStandard', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.ClassStandard);
	dataservice.findStudentTimeTableByClassStandard(StudentTimeTable, request.params.ClassStandard,
	response);
	});

app.post('/StudentTimeTableForClassStandard', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateStudentTimeTableForClassStandard(StudentTimeTable, request.body, response);
	});

app.put('/StudentTimeTableForClassStandard', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createStudentTimeTableForClassStandard(StudentTimeTable, request.body, response);
	});
	
app.del('/StudentTimeTableForClassStandard/:ClassStandard', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.ClassStandard');
	
	dataservice.removeStudentTimeTableForClassStandard(StudentTimeTable, request.params.ClassStandard, response);
	});
	
app.get('/StudentTimeTable', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all TimeTable ' + request.params.key +
				'=' + request.params.value);
				dataservice.listStudentTimeTableForAllClass(StudentTimeTable, response);
	});
	
app.get('/TeacherTimeTable/:TeacherId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.TeacherId);
	dataservice.findTeacherTimeTableByTeacherId(TeacherTimeTable, request.params.TeacherId,
	response);
	});

app.post('/TeacherTimeTable', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateTeacherTimeTable(TeacherTimeTable, request.body, response);
	});

app.put('/TeacherTimeTable', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createTeacherTimeTable(TeacherTimeTable, request.body, response);
	});
	
app.del('/TeacherTimeTable/:TeacherId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.TeacherId');
	console.log(request.params.TeacherId);
	dataservice.removeTeacherTimeTable(TeacherTimeTable, request.params.TeacherId, response);
	});
	
app.get('/TeacherTimeTable', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all teachers with ' + request.params.key +
				'=' + request.params.value);
				dataservice.listTeachersTimeTable(TeacherTimeTable, response);
	});

app.put('/Events', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createEvents(Events, request.body, response);
	});
		
app.get('/Events', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all Events with ' + request.params.key +
				'=' + request.params.value);
				dataservice.listEvents(Events, response);
	});

app.get('/EventsForSchool/:SchoolId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('Listing all Events with ' + request.params.key +
			'=' + request.params.value);
			dataservice.listEventsForSchool(Events, request.params.SchoolId, response);
});

app.get('/EventsForStudent/:StudentId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('Listing all Events with ' + request.params.key +
			'=' + request.params.value);
			dataservice.listEventsForStudent(Events, request.params.SchoolId, response);
});

app.get('/EventsForTeacher/:TeacherId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('Listing all Events with ' + request.params.key +
			'=' + request.params.value);
			dataservice.listEventsForTeacher(Events, request.params.SchoolId, response);
});

	
app.get('/students/:StudentId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.StudentId);
	dataservice.findStudentById(Student, request.params.StudentId,
	response);
	});

app.post('/students', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateStudent(Student, request.body, response);
	});

app.put('/students', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createStudent(Student, request.body, response);
	});
	
app.del('/students/:StudentId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.StudentId');
	console.log(request.params.StudentId);
	dataservice.removeStudent(Student, request.params.StudentId, response);
	});
	
app.get('/students', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all student with ' + request.params.key +
				'=' + request.params.value);
				dataservice.listStudent(Student, response);
	});
	

app.get('/teachers/:TeacherId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.TeacherId);
	dataservice.findTeacherById(request.params.TeacherId,
	response);
	});

app.post('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateTeacher(request.body, response);
	});

app.put('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createTeacher(request.body, response);
	});
	
app.del('/teachers/:TeacherId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.TeacherId');
	console.log(request.params.TeacherId);
	dataservice.removeTeacher(request.params.TeacherId, response);
	});
	
app.get('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");		
		console.log('Listing all teachers with ' + request.params.key +
				'=' + request.params.value);
				dataservice.listTeachers(response);
	});

app.get('/Messages/:Id', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.Id);
	console.log("before " + request.params.Id);
	messagedataservice.findMessagebyId(LocalMessageLogging, request.params.Id,
	response);
	});

app.post('/messages', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	messagedataservice.updateMessage(Message, request.body, response);
	});

app.put('/messages', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	messagedataservice.createMessage(Message, request.body, response);
	});
	
app.del('/messages/:MessageId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.MessageId');
	console.log(request.params.MessageId);
	messagedataservice.deleteMessage(Message, request.params.MessageId, response);
	});
	
app.get('/Messages', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
		console.log('all message with ' + request.params.key +
				'=' + request.params.value);
		messagedataservice.listMessagesLocal(LocalMessageLogging, response);
	});

app.get('/LocalMessagesLogged', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
		console.log('Listing all local messages with ' + request.params.key +
				'=' + request.params.value);
		messagedataservice.listMessagesLocal(LocalMessageLogging, response);
	});
	
app.get('/Messages/From/:Id', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.From);
	messagedataservice.findMessagesFrom(LocalMessageLogging, request.params.Id,
	response);
	});

app.get('/devices/:MobileNumber', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.MobileNumber);
	devicedataservice.findDeviceByMobileNumber(MobileDevice, request.params.MobileNumber,
	response);
	});

app.post('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	devicedataservice.updateDevice(MobileDevice, request.body, response);
	});

app.put('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request);
	console.log(request.body);
	devicedataservice.createMobileDevice(MobileDevice, request.body, response);
	});
	
app.del('/devices/:MobileNumber', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.MobileNumber');
	console.log(request.params.MobileNumber);
	devicedataservice.deleteDevice(MobileDevice, request.params.MobileNumber, response);
	});
	
app.get('/devices', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		console.log('Listing all device with ' + request.params.key +
				'=' + request.params.value);
		devicedataservice.listDevices(MobileDevice, response);
	});

app.get('/devices/:DeviceId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.DeviceId);
	devicedataservice.findDeviceByDeviceID(MobileDevice, request.params.DeviceId,
	response);
	});

app.get('/school/:schoolId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.schoolId);
	schooldataservice.findSchoolbyId(School, request.params.schoolId,
	response);
	});

app.post('/school', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	schooldataservice.updateSchool(School,request, request.body, response);
	});

app.put('/school', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	schooldataservice.createSchool(School,request, request.body, response);
	});
	
	
app.get('/school', function(request, response) {
		
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
	schooldataservice.listSchools(School, response);
	});
	
app.get('/school/SchoolName/:SchoolName', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.SchoolName);
	schooldataservice.findSchoolBySchoolFullName(School, request.params.SchoolName,
	response);
	});


app.get('/TeacherDetailForStudent/:StudentId', function(request, response) {
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Student.findOne({StudentId: request.params.StudentId},
			function(error, result) {
			if (error) {
			console.error(error);
			response.writeHead(500,
			{'Content-Type' : 'text/plain'});
			response.end('Internal server error');
			return;
			} else {
			if (!result) {
			 if (response !== null) {
			   response.writeHead(404, {'Content-Type' : 'text/plain'});
			   response.end('Student Not Found');
			  }
			return;
			}
			else
			{
			if (response !== null){
			  var StudentClassStandard = result.StudentClassStandard;
			  
			  Teacher.find({}, function(error, result) {
					if (error) {
						console.error(error);
						return null;
						}
						if (result !== null) {
						  var Teachers = JSON.parse(JSON.stringify(result));
						  var TeachersList = {
								  Teachers : []
						  };
						  var TeacherList = [];
						  var teachercount=0;
						  for (teachercount=0; teachercount < Teachers.length ; teachercount++  ) {
							  var teacherrolecount =0;
							   for(teacherrolecount =0; teacherrolecount < Teachers[teachercount].TeacherRoleList.length; teacherrolecount++  ){
								   if(Teachers[teachercount].TeacherRoleList[teacherrolecount].TeacherRoleforStd === StudentClassStandard || 
										   Teachers[teachercount].TeacherRoleList[teacherrolecount].TeacherRoleforStd === "All"   )
									   {
									          var teacher = {
									        		   "TeacherId": Teachers[teachercount].TeacherId,
									        		   
									        		    "TeacherFirstName": Teachers[teachercount].TeacherFirstName,
									        		   
									        		    "TeacherLastName":  Teachers[teachercount].TeacherLastName,
									        		    
									        		    "MobileNumber": Teachers[teachercount].MobileNumber,
									        		    
									        		    "EmailId": Teachers[teachercount].EmailId,
									        		    
									        		    "RoleType": Teachers[teachercount].TeacherRoleList[teacherrolecount].TeacherRoleType,
									        	        "RoleforStd": Teachers[teachercount].TeacherRoleList[teacherrolecount].TeacherRoleforStd,
									        	       
									        	        "RoleforSubject": Teachers[teachercount].TeacherRoleList[teacherrolecount].TeacherRoleforSubject,
									        	        
									        	        "ImageUrl": Teachers[teachercount].ImageUrl
									          };
									          TeacherList.push(teacher );
									   }
							   }
							   
							}
						  TeachersList.Teachers = TeacherList;
						  response.end(JSON.stringify(TeachersList));
						}
						
						});
			  
			  //
			 }
			}
			//console.log(result);
			}
			});
	
});

app.get('/GetAllStudentDetailsForTeacher/:TeacherId', function(request, response) {
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	Teacher.findOne({TeacherId: request.params.TeacherId},
			function(error, result) {
			if (error) {
			console.error(error);
			response.writeHead(500,
			{'Content-Type' : 'text/plain'});
			response.end('Internal server error');
			return;
			} else {
			if (!result) {
			 if (response !== null) {
			   response.writeHead(404, {'Content-Type' : 'text/plain'});
			   response.end('Teacher Not Found');
			  }
			return;
			}
			else
			{
			if (response !== null){
			  var TeacherRoleList = result.TeacherRoleList;
			  var StudentList = [];
			  var StudentsList = { StudentList : []};
			  var TeacherRole = [];
			  var teacherRolecount =0;
			  var allstudents = false;
			  for(teacherRolecount = 0; teacherRolecount < result.TeacherRoleList.length; teacherRolecount++ )
				  {
				  if(TeacherRoleList[teacherRolecount].TeacherRoleforStd === "All"){
					  allstudents = true;
					  //TeacherRole = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
				  }
				  TeacherRole.push(TeacherRoleList[teacherRolecount].TeacherRoleforStd);
				  }
				  if(allstudents === false)
				  {
				  Student.find({StudentClassStandard : {$in: TeacherRole } }, function(error, result) {
						if (error) {
							console.error(error);
							return null;
							}
							if (result !== null) {
							  var Students = JSON.parse(JSON.stringify(result));
							  
							  var studentcount=0;
							  for (studentcount=0; studentcount < Students.length ; studentcount++  ) {
								  var parentListcount =0;
								  var student = {
										    "StudentId": Students[studentcount].StudentId, 
										    "StudentFullName": Students[studentcount].StudentFirstName + " " + Students[studentcount].StudentLastName,
										    "StudentClassStandard": Students[studentcount].StudentClassStandard,
										    "ImageUrl": request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Student_"+ Students[studentcount].StudentId +".jpg",
										    "MotherName" : "",
										    "MotherMobile" : "",
										    "MotherEmailID" : "",
										    "FatherName" : "",
										    "FatherMobile" : "",
										    "FatherEmailID" : "",
										    "GuardianName" : "",
										    "GuardianMobile" : "",
										    "GuardianEmailID" : "",
										    
								                };
								   for(parentListcount =0; parentListcount < Students[studentcount].ParentList.length; parentListcount++  ){
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Mother")
										   {
										   student.MotherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.MotherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.MotherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
										          
										   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Father")
									   {
										   student.FatherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.FatherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.FatherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Guardian")
									   {
										   student.GuardianName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.GuardianMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.GuardianEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									  
								   }
								   
								   StudentList.push(student );
								   
								}
							  StudentsList.StudentList = StudentList;
							  response.end(JSON.stringify(StudentsList));
							}
							
						});
				  }
				  else
				  {

                    Student.find({}, function(error, result) {
						if (error) {
							console.error(error);
							return null;
							}
							if (result !== null) {
							  var Students = JSON.parse(JSON.stringify(result));
							  
							  var studentcount=0;
							  for (studentcount=0; studentcount < Students.length ; studentcount++  ) {
								  var parentListcount =0;
								  var student = {
										    "StudentId": Students[studentcount].StudentId, 
										    "StudentFullName": Students[studentcount].StudentFirstName + " " + Students[studentcount].StudentLastName,
										    "StudentClassStandard": Students[studentcount].StudentClassStandard,
										    "ImageUrl": request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Student_"+ Students[studentcount].StudentId +".jpg",
										    "MotherName" : "",
										    "MotherMobile" : "",
										    "MotherEmailID" : "",
										    "FatherName" : "",
										    "FatherMobile" : "",
										    "FatherEmailID" : "",
										    "GuardianName" : "",
										    "GuardianMobile" : "",
										    "GuardianEmailID" : "",
										    
								                };
								   for(parentListcount =0; parentListcount < Students[studentcount].ParentList.length; parentListcount++  ){
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Mother")
										   {
										   student.MotherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.MotherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.MotherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
										          
										   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Father")
									   {
										   student.FatherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.FatherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.FatherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Guardian")
									   {
										   student.GuardianName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.GuardianMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.GuardianEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									  
								   }
								   
								   StudentList.push(student );
								   
								}
							  StudentsList.StudentList = StudentList;
							  response.end(JSON.stringify(StudentsList));
							}
							
						});

				  }
				      
				  }
			  
			  
			  //
			 }
			}
			//console.log(result);
			
			});
	
});

app.get('/GetStudentDetailsForTeacherForClassStandard', function(request, response) {
	  var teacher_id = request.param('TeacherId');
	  var std = request.param('ClassStandard');
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	
	Teacher.findOne({TeacherId: request.param('TeacherId')},
			function(error, result) {
			if (error) {
			console.error(error);
			response.writeHead(500,
			{'Content-Type' : 'text/plain'});
			response.end('Internal server error');
			return;
			} else {
			if (!result) {
			 if (response !== null) {
			   response.writeHead(404, {'Content-Type' : 'text/plain'});
			   response.end('Teacher Not Found');
			  }
			return;
			}
			else
			{
			if (response !== null){
			  var TeacherRoleList = result.TeacherRoleList;
			  var StudentList = [];
			  var TeacherRole = [];
			  var teacherRolecount =0;
			  
			  for(teacherRolecount = 0; teacherRolecount < result.TeacherRoleList.length; teacherRolecount++ )
			  {
			    if(TeacherRoleList[teacherRolecount].TeacherRoleforStd === "All")
			     {
			    	TeacherRole = [request.param('ClassStandard')];
			     }
			    else if(TeacherRoleList[teacherRolecount].TeacherRoleforStd === request.param('ClassStandard') )
			    	{
			           TeacherRole.push(TeacherRoleList[teacherRolecount].TeacherRoleforStd);
			    	}
			    }
				  
				  Student.find({StudentClassStandard : {$in: TeacherRole } }, function(error, result) {
						if (error) {
							console.error(error);
							return null;
							}
							if (result !== null) {
							  var Students = JSON.parse(JSON.stringify(result));
							  
							  var studentcount=0;
							  for (studentcount=0; studentcount < Students.length ; studentcount++  ) {
								  var parentListcount =0;
								  var student = {
										    "StudentId": Students[studentcount].StudentId, 
										    "StudentFullName": Students[studentcount].StudentFirstName + " " + Students[studentcount].StudentLastName,
										    "StudentClassStandard": Students[studentcount].StudentClassStandard,
										    "ImageUrl": request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Student_"+ Students[studentcount].StudentId +".jpg",
										    "MotherName" : "",
										    "MotherMobile" : "",
										    "MotherEmailID" : "",
										    "FatherName" : "",
										    "FatherMobile" : "",
										    "FatherEmailID" : "",
										    "GuardianName" : "",
										    "GuardianMobile" : "",
										    "GuardianEmailID" : "",
										    
								                };
								   for(parentListcount =0; parentListcount < Students[studentcount].ParentList.length; parentListcount++  ){
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Mother")
										   {
										   student.MotherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.MotherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.MotherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
										          
										   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Father")
									   {
										   student.FatherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.FatherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.FatherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Guardian")
									   {
										   student.GuardianName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.GuardianMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.GuardianEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									  
								   }
								   
								   StudentList.push(student );
								   
								}
							  var StudentsList = { StudentList : []};
							  StudentsList.StudentList = StudentList;
							  response.end(JSON.stringify(StudentsList));
							}
							
							});
				      
				  }
			  
			  
			  //
			 }
			}
			//console.log(result);
			
			});
	
});


app.get('/test/:mobile', function(request,response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Student.find({'ParentList.MobileNumber': request.params.mobile},function(error, result){
		if(error)
			{
			  console.log(error);
			}
		else
			{
			response.end(JSON.stringify(result));
			}
	});
});

app.get('/GetTeacherOrParentRole/:mobile', function(request, response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var getalldata = {
			"Teacher": null,
			"Students" : [ ],
			"School" : null,
	};
	
	Teacher.findOne({MobileNumber: request.params.mobile},
			function(error, result) 
			{
			  if (error)
				  {
			        console.error(error);
			        response.writeHead(500,{'Content-Type' : 'text/plain'});
			        response.end('Internal server error');
			        return;
			     } 
				 else 
				 {
			       if (!result) 
				   {console.log('inside no resul');
			          if (response !== null) 
					  {
			        	  console.log('inside student find mob ');
						    Student.find({'ParentList.MobileNumber': request.params.mobile},function(error, data){
		                    if(error)
			                  {
			                       console.log(error);
								   response.writeHead(500,{'Content-Type' : 'text/plain'});
			                       response.end('Internal server error');
			                       return;
			                  }
		                     else
			                   {
		                    	 
		                    	 var schoolid ="";
		                    	 if(data !== null && data.length > 0)
		                    	 {
		                    		 
		                    	   var scount = 0;
		                    	   for(scount=0; scount <data.length ;scount++)
		                    		   {
		                    		   
		                    		     if(data[scount].ImageUrl !==undefined && data[scount].StudentId !== undefined)
		                    		    	 {
		                    		    	 schoolid = data[scount].SchoolId;
		                    		    	 data[scount].ImageUrl = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Student_"+ data[scount].StudentId +".jpg";
		                    		    	 }
		                    		   }
		                    	 
		                    	 }
		                    	 
			                     getalldata.Students = data;
			                     
			                     School.findOne({SchoolId: schoolid},
			                    			function(errorsc, resultsc) {
			                    			if (errorsc)
			                    			{
			                    			   console.error(errorsc);
			                    			   response.end(JSON.stringify(getalldata));
			                    			} 
			                    			else 
			                    			{
			                    			  if (resultsc) 
			                    			  {
			                    				  resultsc.ImageUrl = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Large_"+ resultsc.SchoolId +".jpg";
			                    				  resultsc.ImageUrlLogo = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Logo_"+ resultsc.SchoolId +".jpg";
			                    			   }
			                    			  getalldata.School = resultsc;
			                    			  response.end(JSON.stringify(getalldata));
			                    			}
			                    			});
			                     
								 
			                   }
	                          });
						 
						 
			          }
		      
			       }
			      else
			      {
			        if (response !== null)
					{
			           getalldata.Teacher = result;
			           getalldata.Teacher.ImageUrl = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Teacher_"+ result.TeacherId +".jpg";
			           var schoolid = getalldata.Teacher.SchoolId;
			           Student.find({'ParentList.MobileNumber': request.params.mobile},function(error, data){
		                    if(error)
			                  {
			                       console.log(error);
								   response.writeHead(500,{'Content-Type' : 'text/plain'});
			                       response.end('Internal server error');
			                       return;
			                  }
		                     else
			                   {
			                     
			                     if(data !== null && data.length > 0)
		                    	 {
		                    	   var scount = 0;
		                    	   for(scount=0; scount <data.length ;scount++)
		                    		   {
		                    		     if(data[scount].ImageUrl !==undefined && data[scount].StudentId !== undefined)
		                    		    	 {
		                    		    	 schoolid = data[scount].SchoolId;
		                    		    	 data[scount].ImageUrl = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Student_"+ data[scount].StudentId +".jpg";
		                    		    	 }
		                    		   }
		                    	 
		                    	 }
			                     getalldata.Students = data;
			                     
			                     School.findOne({SchoolId: schoolid},
			                    			function(errorsc, resultsc) {
			                    			if (errorsc)
			                    			{
			                    			   console.error(errorsc);
			                    			   response.end(JSON.stringify(getalldata));
			                    			} 
			                    			else 
			                    			{
			                    			  if (resultsc) 
			                    			  {
			                    				  resultsc.ImageUrl = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Large_"+ resultsc.SchoolId +".jpg";
			                    				  resultsc.ImageUrlLogo = request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Logo_"+ resultsc.SchoolId +".jpg";
			                    			   }
			                    			  getalldata.School = resultsc;
			                    			  response.end(JSON.stringify(getalldata));
			                    			}
			                    			});
			                     
								 
			                   }
	                          });
							
					}
			     }
			}
			//console.log(result);
			
			});
	
});


app.get('/testingalldata/:mobile', function(request, response){
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var getalldata = {
			"Teacher": null,
			"Students" : [ ],
			"AllTeachers" : [ ],
			"AllStudents" : [ ]
	};
	
	Teacher.findOne({MobileNumber: request.params.mobile},
			function(error, result) 
			{
			  if (error)
				  {
			        console.error(error);
			        response.writeHead(500,{'Content-Type' : 'text/plain'});
			        response.end('Internal server error');
			        return;
			     } 
				 else 
				 {
			       if (!result) 
				   {
			          if (response !== null) 
					  {
			   
			          }
		      
			       }
			      else
			      {
			        if (response !== null)
					{
			           getalldata.Teacher = result;
			           var TeacherRoleList = result.TeacherRoleList;
			           var StudentList = [];
			           var TeacherRole = [];
			           var teacherRolecount =0;
			           for(teacherRolecount = 0; teacherRolecount < result.TeacherRoleList.length; teacherRolecount++ )
				       {
				         if(TeacherRoleList[teacherRolecount].TeacherRoleforStd === "All")
						 {
					        TeacherRole = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
				         }
				         TeacherRole.push(TeacherRoleList[teacherRolecount].TeacherRoleforStd);
				       }
				  
				       Student.find({StudentClassStandard : {$in: TeacherRole } }, function(error, result) {
						   if (error) 
						   {
							console.error(error);
							return null;
						   }
						   if (result !== null) 
						    {
							    var Students = JSON.parse(JSON.stringify(result));
							  
							    var studentcount=0;
							    for (studentcount=0; studentcount < Students.length ; studentcount++  ) 
								{
								  var parentListcount =0;
								  var student = {
										    "StudentId": Students[studentcount].StudentId, 
										    "StudentFullName": Students[studentcount].StudentFirstName + " " + Students[studentcount].StudentLastName,
										    "StudentClassStandard": Students[studentcount].StudentClassStandard,
										   
										    "StudentMotherName" : "",
										    "StudentMotherMobile" : "",
										    "StudentMotherEmailID" : "",
										    "StudentFatherName" : "",
										    "StudentFatherMobile" : "",
										    "StudentFatherEmailID" : "",
										    "StudentGuardianName" : "",
										    "StudentGuardianMobile" : "",
										    "StudentGuardianEmailID" : "",
										    
								                };
								     for(parentListcount =0; parentListcount < Students[studentcount].ParentList.length; parentListcount++  )
									 {
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Mother")
										   {
										   student.StudentMotherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.StudentMotherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.StudentMotherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
										          
										   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Father")
									   {
										   student.StudentFatherName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.StudentFatherMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.StudentFatherEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									   if(Students[studentcount].ParentList[parentListcount].ParentType === "Guardian")
									   {
										   student.StudentGuardianName = Students[studentcount].ParentList[parentListcount].ParentFirstName + " " + Students[studentcount].ParentList[parentListcount].ParentLastname;
										   student.StudentGuardianMobile = Students[studentcount].ParentList[parentListcount].MobileNumber;
										   student.StudentGuardianEmailID = Students[studentcount].ParentList[parentListcount].EmailId;
									          
									   }
									  
								    }
								   
								   StudentList.push(student );
								   
								}
							  
							  getalldata.AllStudents = StudentList;
							  response.end(JSON.stringify(getalldata));
							}
							
							});
							
					}
			     }
			}
			//console.log(result);
			
			});
	
});

app.put('/SendNotificationOrMessages', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };
		  
	var Mobiles = [];
	var tocount =0;
	console.log('inside sendnotification');
	console.log(request.body);
	for(tocount=0; tocount < request.body.To.length ; tocount++)
		{
		  
		   Mobiles.push(request.body.To[tocount].Mobile);
		}
	var message = new gcm.Message({
	    
		data: {
	    	"type" : "Notice",
	        "body": request.body.MessageBody,
	        "title": request.body.MessageTitle,
	        "priority" : 1,
	        "date": new Date().yyyymmdd(),
	        "notification_id": (staticnotificationid + 1).toString()
	        
	    },
	    notification: {
	        title: "From node app SchoolParent Interaction Server ",
	        icon: "ic_launcher",
	        body: "This is a notification that will be displayed ASAP."
	    }
	});

	
	var registrationTokens = [];
	MobileDevice.find({MobileNumber: {$in: Mobiles}},
	 function(error, data) {
		if (error)
		{
		console.error(error);
		return null;
		}
		else 
		{			
			if(data !==undefined)
			{
				var Mobiles = JSON.parse(JSON.stringify(data));
				var mobilecount=0;
				  for (mobilecount=0; mobilecount < Mobiles.length ; mobilecount++  ) {
				console.log(Mobiles[mobilecount].DeviceId);
				registrationTokens.push(Mobiles[mobilecount].DeviceId);	
				}
				// Set up the sender with you API key
				var sender = new gcm.Sender('AIzaSyDvbQO3k8lkZzsN6xpRmYmg9RkDDpbPKgA');

				// Now the sender can be used to send messages
				// ... or retrying a specific number of times (10)
				sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
				  if(err) {console.error(err);}
				  else    {console.log(response);}
				});
			}
		}
	});
	
	
	messagedataservice.createMessage(Message, request.body, response);
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.end('Ended final');
	});
	

app.put('/SendMessageToMultipleUser', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };
		  
	var message = new gcm.Message({
	    
	    data: {
	    	"type" : request.body.type,
	        "body": request.body.MessageBody,
	        "title": request.body.MessageTitle,
	        "priority" : 1,
	        "date": new Date().yyyymmdd(),
	        "notification_id": (staticnotificationid + 1).toString(),
	        "ImageUrl" : request.body.ImageUrl ,
	        "FromType" : request.body.FromType,
	        "FromId" : request.body.FromId,
			"FromName" : request.body.From,
	        "ToIds" :  request.body.ToIds
	        
	        
	    },
	    notification: {
	        title: "From node app SchoolParent Interaction Server ",
	        icon: "ic_launcher",
	        body: "This is a notification that will be displayed ASAP."
	    }
	});

	
	var registrationTokens = [];
	MobileDevice.find({MobileNumber: {$in: request.body.MobileNumbers}},
	 function(error, data) {
		if (error)
		{
		console.error(error);
		return null;
		}
		else 
		{			
			if(data !==undefined)
			{
				var Mobiles = JSON.parse(JSON.stringify(data));
				var mobilecount=0;
				  for (mobilecount=0; mobilecount < Mobiles.length ; mobilecount++  ) {
				console.log(Mobiles[mobilecount].DeviceId);
				registrationTokens.push(Mobiles[mobilecount].DeviceId);	
				}
				  //Set up Messaging for Local Logging
				  var localmsg = new LocalMessageLogging({
					    "type" : request.body.type,
				        "body": request.body.MessageBody,
				        "title": request.body.MessageTitle,
				        
				        "date": new Date().yyyymmdd(),
				        "notification_id": (staticnotificationid).toString(),
				        "ImageUrl" : request.body.ImageUrl ,
				        "FromType" : request.body.FromType,
				        "FromId" : request.body.FromId,
						"FromName" : request.body.From,
				        "ToIds" :  request.body.ToIds,
				        "MobileNumbers" : request.body.MobileNumbers,
				        "Error" : " "
				  });
				  
				// Set up the sender with you API key
				  
				var sender = new gcm.Sender('AIzaSyDvbQO3k8lkZzsN6xpRmYmg9RkDDpbPKgA');

				// Now the sender can be used to send messages
				// ... or retrying a specific number of times (10)
				sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
				  if(err) {
					  console.error(err);
					  localmsg.Error = err;
					  localmsg.save(function(error){
							if (error)
								{
								console.log(error);
								}
							console.log('Local Message saved successfully');
						});
					  }
				  else    {
					  console.log(response);
					  localmsg.RespMessage = response;
					  localmsg.save(function(error){
							if (error)
								{
								console.log(error);
								}
							console.log('Local Message saved successfully');
						});
					  }
				});
			}
		}
	});
	
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.end('Ended final');
	});

app.put('/SendMessage', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };

	var message = new gcm.Message({
	    
		data: {
	    	"type" : "Notice",
	        "body": request.body.MessageBody,
	        "title": request.body.MessageTitle,
	        "priority" : 1,
	        "date": new Date().yyyymmdd(),
	        "notification_id": (staticnotificationid + 1).toString()
	        
	    },
	    notification: {
	        title: "From node app SchoolParent Interaction Server ",
	        icon: "ic_launcher",
	        body: "This is a notification that will be displayed ASAP."
	    }
	});
	
	// Set up the sender with you API key
	var sender = new gcm.Sender('AIzaSyDvbQO3k8lkZzsN6xpRmYmg9RkDDpbPKgA');
	var registrationTokens = [];
	
	MobileDevice.find({}, function(error, result) {
		if (error) 
		{
		console.error(error);
		return null;
		}
		else
		{
			var resultcount =0;
			if(result !==undefined)
			{
				console.log("inside result");
				console.log(result.length);
				for(resultcount =0; resultcount<result.length; resultcount++)
				{
					console.log("for");
					console.log(result[resultcount].DeviceId);
					registrationTokens.push(result[resultcount].DeviceId);

				}
			}

			// Now the sender can be used to send messages
			// ... or retrying a specific number of times (10)
			sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
			  if(err) 
				  {
				  console.error(err);
				  }
			  else   
				  {
				   console.log(response);
				  }
			});
	
	  }
		
	});

	
	
	// Send to a topic, with no retry this time
	sender.sendNoRetry(message, { topic: '/topics/global' }, function (err, response) {
	    if(err) {console.error(" Error " + err);}
	    else    {console.log("Success " + response);}
	});
	
	
	response.end('Ended final');
	});

app.put('/SendMessageToSingleUser', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	Date.prototype.yyyymmdd = function() {
		   var yyyy = this.getFullYear();
		   var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
		   var dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
		   return "".concat(dd).concat("/").concat(mm).concat("/").concat(yyyy);
		  };
		  
	var message = new gcm.Message({
	    
		data: {
	    	"type" : "Notice",
	        "body": request.body.MessageBody,
	        "title": request.body.MessageTitle,
	        "priority" : 1,
	        "date": new Date().yyyymmdd(),
	        "notification_id": (staticnotificationid + 1).toString()
	        
	    },
	    notification: {
	        title: "From node app SchoolParent Interaction Server ",
	        icon: "ic_launcher",
	        body: "This is a notification that will be displayed ASAP."
	    }
	});


	var registrationTokens = [];
	MobileDevice.findOne({MobileNumber: request.body.MobileNumber},
	 function(error, data) {
		if (error)
		{
		console.error(error);
		return null;
		}
		else 
		{			
			if(data !==undefined)
			{
				console.log(data.DeviceId);
				registrationTokens.push(data.DeviceId);	
				// Set up the sender with you API key
				var sender = new gcm.Sender('AIzaSyDvbQO3k8lkZzsN6xpRmYmg9RkDDpbPKgA');

				// Now the sender can be used to send messages
				// ... or retrying a specific number of times (10)
				sender.send(message, { registrationTokens: registrationTokens }, 10, function (err, response) {
				  if(err) {console.error(err);}
				  else    {console.log(response);}
				});
			}
		}
	});
	
	
	response.end('Ended final');
	});

app.del('/uploadTeacherOrStudentImage/:file', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('delete');
	var file = req.params.file;
    var filename = __dirname + "/Images/" + file;
    if(fs.existsSync(filename))
    	{
    	  console.log('exists');
    	  fs.unlink(filename);
    	}
    res.end('Done deleting the file');
});


//Post CNN Signed Image files
//Post CNN Signed Image files
app.post('/uploadTeacherOrStudentImage', function(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
	var filename = req.files.picture.name;
	
	if(filename.endsWith(".jpg") || filename.endsWith(".png") || filename.endsWith(".bmp") || filename.endsWith(".gif"))
			{
		       filename  = filename.slice(0, -4);
			}
	else 
		{
		  
		  if(filename.endsWith(".jpeg") || filename.endsWith(".html"))
		   {
	          filename  = filename.slice(0, -5);
		   }
		
		}

		 var xlFile = req.files.picture;
  	     var newPath = __dirname + "/Images/" + req.files.picture.name;
		 
		 xlFile.mv(newPath, function(err){ 
		   if(err){
			   res.send("Error Uploading File");
		   }
		   else
		   {
	  cloudinary.uploader.upload(
			  newPath,
			  function(result) { console.log(result); console.log(result.url); 
			  var ImageInfo = {
 		    		 "ImageName" : filename,
 		    		 "ImageUrl": result.url
 		     };
 		     res.json(ImageInfo);
			 fs.unlink(newPath);  
			  },
			  {
			    public_id: filename, 
			    
			  }      
			);
		   }
		 });
});
    
 // Show files
    app.get('/uploadTeacherOrStudentImage/:file', function (req, res){
    	res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      var file = req.params.file;
      var img = fs.readFileSync(__dirname + "/Images/" + file);
      res.writeHead(200, {'Content-Type': 'image/jpg' });
      res.end(img, 'binary');
    });
 
 app.post('/uploadStudentData', function(req, res) {
     
	 res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  console.log("1");
	  console.log(req.files.picture);	
  	  var xlFile = req.files.picture;

		var schoolId = req.body.schoolId;
	console.log("School id is "+ schoolId);
  	  //console.log(req.file.picture.path);
  	   var newPath = __dirname + "/Images/" + req.files.picture.name;
	   xlFile.mv(newPath, function(err){ 
		   if(err){
			   res.send("Error Uploading File");
		   }
		   else
		   {
               try {
  	    		xlsxtojson({
                      input: newPath,
                      output: null, //since we don't need output.json
                      lowerCaseHeaders:true
                  }, function(err,result){
                      if(err) {
                          return res.json({error_code:1,err_desc:err, data: null});
                      } 
                      res.json({data: result});
                      var i=0;
                      for(i=0; i<result.length; i++)
                      	{
                      	 console.log(i);
                      	 console.log(result[i]);
                      	 console.log(result[i].studentid);
                      	 
                      	var ParentList = [];
                      	
                      	var father = {
                      			ParentType : "Father",
                		    	ParentFirstName : result[i].fatherfirstname,
                		    	ParentLastname : result[i].fatherfirstname,
                		    	MobileNumber : result[i].fathercontact,
                		    	AlternateMobNumber : result[i].fathercontact,
                		    	EmailId : result[i].fatheremailid,
                		    	AlternateEmailID : result[i].fatheremailid,
                		    	PresentAddress : result[i].address,
                		    	PresentAddressPOBox : result[i].PresentAddressPOBox,
                		    	PermanentAddress : result[i].PermanentAddress,
                		    	PermanentAddressPOBox : result[i].PermanentAddressPOBox	
                      	};
                      	
                      	var mother = {
                      			ParentType : "Mother",
                		    	ParentFirstName : result[i].motherfirstname,
                		    	ParentLastname : result[i].motherfirstname,
                		    	MobileNumber : result[i].fathercontact,
                		    	AlternateMobNumber : result[i].mothercontact,
                		    	EmailId : result[i].motheremailid,
                		    	AlternateEmailID : result[i].motheremailid,
                		    	PresentAddress : result[i].address,
                		    	PresentAddressPOBox : result[i].PresentAddressPOBox,
                		    	PermanentAddress : result[i].PermanentAddress,
                		    	PermanentAddressPOBox : result[i].PermanentAddressPOBox	
                      	};
                      	
                      	ParentList.push(father);
                      	ParentList.push(mother);
                      	
                      	var ParentMobileList = [];
                      	ParentMobileList.push(result[i].fathercontact);
                      	ParentMobileList.push(result[i].mothercontact);
                      	 
                      	var student =  new Student(
                      			{
                      				StudentId: result[i].studentfirstname + result[i].fatherfirstname + result[i].dob + schoolId,
                      				SchoolId: req.body.schoolId,
                      				StudentFirstName: result[i].studentfirstname,
                      				StudentMiddleName: result[i].studentmiddleName,
                      				StudentLastName: result[i].studentfirstname,
                      				StudentDOB: result[i].dob,
                      				Age: result[i].Age,
                      				StudentGender: result[i].gender,
                      				StudentClassStandard: result[i].classstandard,
                      				StudentFullAddress: result[i].address,
                      				ImageUrl: " ",
                      				ParentList : ParentList,
                      				StudentParentMobiles: ParentMobileList
                      				
                      			});
                      	
                      	dataservice.AddOrUpdateStudent(Student,student);
                      	}

						 fs.unlink(newPath);  
                  });
              } catch (e){
                  res.json({error_code:1,err_desc:"Corupted excel file"});
              }
  	      
		   }
		   }); 
  	});


app.post('/uploadClassData', function(req, res) {
     
	 res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  
	  console.log(req.files.picture);	
  	  var xlFile = req.files.picture;

		
  	   var newPath = __dirname + "/Images/" + req.files.picture.name;
	   xlFile.mv(newPath, function(err){ 
		   if(err){
			   res.send("Error Uploading File");
		   }
		   else
		   {
               try {
  	    		xlsxtojson({
                      input: newPath,
                      output: null, //since we don't need output.json
                      lowerCaseHeaders:true
                  }, function(err,result){
                      if(err) {
                          return res.json({error_code:1,err_desc:err, data: null});
                      } 
                      res.json({data: result});
                      var i=0;
                      for(i=0; i<result.length; i++)
                      	{
                      	 console.log(i);
                      	 console.log(result[i]);
                      	 
                      	var clss =  new Class(
                      			{
                      				Class: result[i].class ,
                      				Section: result[i].section,
                      				ClassSection: result[i].class + result[i].section,
									SchoolId: req.body.schoolId  
                      				
                      				
                      			});
                      	
                      	dataservice.updateClass(Class,clss,res);
                      	}

						 fs.unlink(newPath);  
                  });
              } catch (e){
                  res.json({error_code:1,err_desc:"Corupted excel file"});
              }
  	      
		   }
		   }); 
  	});
	
	
app.post('/uploadSubjectData', function(req, res) {
     
	 res.header("Access-Control-Allow-Origin", "*");
    	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  
	  console.log(req.files.picture);	
  	  var xlFile = req.files.picture;

		
  	   var newPath = __dirname + "/Images/" + req.files.picture.name;
	   xlFile.mv(newPath, function(err){ 
		   if(err){
			   res.send("Error Uploading File");
		   }
		   else
		   {
               try {
  	    		xlsxtojson({
                      input: newPath,
                      output: null, //since we don't need output.json
                      lowerCaseHeaders:true
                  }, function(err,result){
                      if(err) {
                          return res.json({error_code:1,err_desc:err, data: null});
                      } 
                      res.json({data: result});
                      var i=0;
                      for(i=0; i<result.length; i++)
                      	{
                      	 console.log(i);
                      	 console.log(result[i]);
                      	 
                      	var subject =  new Subject(
                      			{
                      				Subject: result[i].subject ,
                      				SubjectCode: result[i].subjectcode,
									SchoolId: req.body.schoolId
                      				
                      				
                      			});
                      	
                      	dataservice.updateSubject(Subject,subject,res);
                      	}

						 fs.unlink(newPath);  
                  });
              } catch (e){
                  res.json({error_code:1,err_desc:"Corupted excel file"});
              }
  	      
		   }
		   }); 
  	});

app.post('/uploadMultipleSubjectData', function(req, res) {
     
	 res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                      var i=0;
                      for(i=0; i<req.body.length; i++)
                      	{
                      	 console.log(i);
                      	 console.log(req.body[i]);
                      	 
                      	var subject =  new Subject(
                      			{
                      				Subject: req.body[i].Subject ,
                      				SubjectCode: req.body[i].SubjectCode,
									SchoolId: req.body[i].SchoolId
                      				
                      				
                      			});
                      	
                      	dataservice.updateSubject(Subject,subject,res);
					}
					
					res.json({"code" : 200, "status" : "Subject Records saved successfully"});
         
});

app.post('/uploadMultipleClassData', function(req, res) {
     
	 res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  

               
                      var i=0;
                      for(i=0; i<req.body.length; i++)
                      	{
                      	 console.log(i);
                      	 console.log(req.body[i]);
                      	 
                      	var clss =  new Class(
                      			{
                      				Class: req.body[i].Class ,
                      				Section: req.body[i].Section,
                      				ClassSection: req.body[i].Class + req.body[i].Section,
									SchoolId: req.body[i].SchoolId  
                      				
                      				
                      			});
                      	
                      	dataservice.updateClass(Class,clss,res);
					}
					
					res.json({"code" : 200, "status" : "Class Records saved successfully"});
     
  	});




app.get('/',function(req, res) {
	res.sendfile(path.join(__dirname, 'app_client', 'index.html'));
});	

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		res.status(401);
		res.json({"message" : err.name + ": " + err.message});
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
