
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
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

var cloudinary = require('cloudinary');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

cloudinary.config({ 
	  cloud_name: 'schoolsync', 
	  api_key: '388181157936776', 
	  api_secret: 'Dp6rilZ1xAYNy83mxi9XWOh_cCE' 
	});


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var dbURI = 'mongodb://localhost/SchoolsDB';
if (process.env.NODE_ENV === 'production') {
	dbURI = process.env.MONGOLAB_URI;
}

console.log('Connecting to DB ' + dbURI);

mongoose.connect(dbURI);


var SchoolSchema = new mongoose.Schema({
	SchoolId: {type: String, required: true, unique: true },
	SchoolFullName: {type: String, required: true},
	SchoolFullAddress: String,
	SchoolMainTelephoneNumber: {type:Number ,required: true},
	AdditionalContactNumbers: 
		[
		 Number
		 ],
	SchoolWebSite: String,
	SchoolCity: String,
	SchoolState: String,
	SchoolAddressPOBox: Number,
	SchoolDistrict: String,
	SchoolType: String,
	ImageUrl: String,
	ImageUrlLogo: String
});

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

var TeacherRoleSchema = new mongoose.Schema({
	TeacherRole: String
});

var TeacherSchema = new mongoose.Schema({
	TeacherId: {type: String, required: true, unique: true },
	SchoolId: String,
	TeacherFirstName: {type: String, required: true},
	TeacherMiddleName: String,
	TeacherLastName: {type: String, required: true},
	TeacherDOB : Date,
	Age : Number,
	TeacherGender: String,
	TeacherFullAddress: String,
	MobileNumber: {type:Number ,required: true},
	AlternateMobNumber: Number,
	EmailId: String,
	AlternateEmailID: String,
	PresentAddress: String,
	PresentAddressPOBox: Number,
	PermanentAddress: String,
	PermanentAddressPOBox: Number,
	ImageUrl: String,
	/*Messages:
		[
		 {
		 Message: String,
		 Delivered: Boolean
		 }
		],*/
	TeacherRoleList: [
		{
			TeacherRoleType: String,
			TeacherRoleforStd: String,
			TeacherRoleforSubjectId: String,
			TeacherRoleforSubject: String
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


var School = mongoose.model('School', SchoolSchema);

var Student = mongoose.model('Student', StudentSchema);

var ParentType = mongoose.model('ParentType', ParentTypeSchema);

var TeacherType = mongoose.model('TeacherType', TeacherRoleSchema);

var Teacher = mongoose.model('Teacher', TeacherSchema);

var MobileDevice = mongoose.model('MobileDevice', MobileDeviceMappingSchema);

var Message = mongoose.model('Message', MessageSchema);

var StudentTimeTable = mongoose.model('StudentTimeTable', StudentTimeTableSchema);

var TeacherTimeTable = mongoose.model('TeacherTimeTable', TeacherTimeTableSchema);

var Events = mongoose.model('Events', EventsSchema);

var staticnotificationid = 100000;

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
	dataservice.findTeacherById(Teacher, request.params.TeacherId,
	response);
	});

app.post('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.updateTeacher(Teacher, request.body, response);
	});

app.put('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	dataservice.createTeacher(Teacher, request.body, response);
	});
	
app.del('/teachers/:TeacherId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.TeacherId');
	console.log(request.params.TeacherId);
	dataservice.removeTeacher(Teacher, request.params.TeacherId, response);
	});
	
app.get('/teachers', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");		
		console.log('Listing all teachers with ' + request.params.key +
				'=' + request.params.value);
				dataservice.listTeachers(Teacher, response);
	});

app.get('/messages/:MessageId', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.MessageId);
	messagedataservice.findMessagebyId(Message, request.params.MessageId,
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
	
app.get('/messages', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");	
		console.log('Listing all messages with ' + request.params.key +
				'=' + request.params.value);
		messagedataservice.listMessages(Message, response);
	});
	
app.get('/messages/from/:From', function(request, response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(request.url + ' : querying for ' +
	request.params.From);
	messagedataservice.findMessagesFrom(Message, request.params.From,
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
	
app.del('/school/:SchoolId', function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.SchoolId');
	console.log(request.params.SchoolId);
	schooldataservice.deleteSchool(School, request.params.SchoolId, response);
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
									        	        
									        	        "ImageUrl": request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "Teacher_"+ Teachers[teachercount].TeacherId +".jpg"
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
			  for(teacherRolecount = 0; teacherRolecount < result.TeacherRoleList.length; teacherRolecount++ )
				  {
				  if(TeacherRoleList[teacherRolecount].TeacherRoleforStd === "All"){
					  TeacherRole = ["1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th"];
				  }
				  TeacherRole.push(TeacherRoleList[teacherRolecount].TeacherRoleforStd);
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
	  cloudinary.uploader.upload(
			  req.files.picture.path,
			  function(result) { console.log(result); console.log(result.url); 
			  var ImageInfo = {
 		    		 "ImageName" : filename,
 		    		 "ImageUrl": result.url
 		     };
 		     res.json(ImageInfo);
			  },
			  {
			    public_id: filename, 
			    
			  }      
			);
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
 

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
