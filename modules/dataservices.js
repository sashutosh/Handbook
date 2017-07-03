/**
 * http://usejsdoc.org/
 */

require('../app_api/models/teachers');
var mongoose = require('mongoose');
var Teacher = mongoose.model('Teacher');



function toMessageList(bodyMessage)
{
   var MessageList = [];
   var messagecount = 0;
   if(bodyMessage !=undefined)
	{  
   for(messagecount =0; messagecount < bodyMessage.length ; messagecount++)
	   {
	     var Message = {
	    	 Message: bodyMessage[messagecount].Message,
	    	 Delivered: bodyMessage[messagecount].Delivered
	     };
	     
	     MessageList.push(Message);
	   }
	}
   return MessageList;
}

function toParentList(bodyParent)
{
	var ParentList = [];
	var parentcount=0;
	if(bodyParent !=undefined)
    {
	for(parentcount =0; parentcount <bodyParent.length; parentcount++)
		{
		    var Parent = {
		    	ParentType : bodyParent[parentcount].ParentType,
		    	ParentFirstName : bodyParent[parentcount].ParentFirstName,
		    	ParentLastname : bodyParent[parentcount].ParentLastname,
		    	MobileNumber : bodyParent[parentcount].MobileNumber,
		    	AlternateMobNumber : bodyParent[parentcount].AlternateMobNumber,
		    	EmailId : bodyParent[parentcount].EmailId,
		    	AlternateEmailID : bodyParent[parentcount].AlternateEmailID,
		    	PresentAddress : bodyParent[parentcount].PresentAddress,
		    	PresentAddressPOBox : bodyParent[parentcount].PresentAddressPOBox,
		    	PermanentAddress : bodyParent[parentcount].PermanentAddress,
		    	PermanentAddressPOBox : bodyParent[parentcount].PermanentAddressPOBox
		    	//Messages : toMessageList(bodyParent[parentcount].Messages)
		    	
		    };
		    ParentList.push(Parent);
		}
    }
	return ParentList;
}

function toParentMobileList(bodyParent)
{
	var ParentMobileList = [];
	var parentcount=0;
	if(bodyParent !== undefined)
    {
	for(parentcount =0; parentcount <bodyParent.length; parentcount++)
		{
		   
		    ParentMobileList.push(bodyParent[parentcount].MobileNumber);
		}
    }
	return ParentMobileList;
}

function toTeacherRoleList(bodyTeacherRole)
{
	var TeacherRoleList = [];
	var teacherrolecount=0;
	if(bodyTeacherRole !=undefined)
    {
	for(teacherrolecount =0; teacherrolecount <bodyTeacherRole.length; teacherrolecount++)
		{
		    var TeacherRole = {
		    		TeacherRoleType : bodyTeacherRole[teacherrolecount].TeacherRoleType,
		    		TeacherRoleforStd : bodyTeacherRole[teacherrolecount].TeacherRoleforStd,
		    		TeacherRoleforSubjectId : bodyTeacherRole[teacherrolecount].TeacherRoleforSubjectId,
		    		TeacherRoleforSubject : bodyTeacherRole[teacherrolecount].TeacherRoleforSubject,
		    };
		    TeacherRoleList.push(TeacherRole);
		}
    }
	return TeacherRoleList;
}

function toStudent(body, Student) {
var student =  new Student(
{
	StudentId: body.StudentId,
	SchoolId: body.SchoolId,
	StudentFirstName: body.StudentFirstName,
	StudentMiddleName: body.StudentMiddleName,
	StudentLastName: body.StudentLastName,
	StudentDOB: body.StudentDOB,
	Age: body.Age,
	StudentGender: body.StudentGender,
	StudentClassStandard: body.StudentClassStandard,
	StudentFullAddress: body.StudentFullAddress,
	ImageUrl: body.ImageUrl,
	ParentList : toParentList(body.ParentList),
	StudentParentMobiles: toParentMobileList(body.ParentList)
	
});



return student;
}

function toTeacher(body, Teacher)
{
	var teacher = new Teacher({
		TeacherId : body.TeacherId,
		SchoolId: body.SchoolId,
		TeacherFirstName: body.TeacherFirstName,
		TeacherMiddleName: body.TeacherMiddleName,
		TeacherLastName: body.TeacherLastName,
		TeacherDOB : body.TeacherDOB,
		Age : body.Age,
		TeacherGender: body.TeacherGender,
		TeacherFullAddress: body.TeacherFullAddress,
		MobileNumber: body.MobileNumber,
		AlternateMobNumber: body.AlternateMobNumber,
		EmailId: body.EmailId,
		AlternateEmailID: body.AlternateEmailID,
		PresentAddress: body.PresentAddress,
		PresentAddressPOBox: body.PresentAddressPOBox,
		PermanentAddress: body.PermanentAddress,
		PermanentAddressPOBox: body.PermanentAddressPOBox,
		ImageUrl: body.ImageUrl,
		//Messages: toMessageList(body.Messages),
		TeacherRoleList : toTeacherRoleList(body.TeacherRoleList)
	});
	
	return teacher;
}

function toStudentTimeSlotList(bodyts)
{
	var TimeSlotList = [];
	var count=0;
	if(bodyts !==undefined)
    {
	for(count =0; count <bodyts.length; count++)
		{
		    var timeslot = {
		    	StartTime : bodyts[count].StartTime,
		    	EndTime : bodyts[count].EndTime,
		    	PeriodNumber:  bodyts[count].PeriodNumber,
		    	TeacherId : bodyts[count].TeacherId,
		    	TeacherName : bodyts[count].TeacherName,
		    	SubjectId : bodyts[count].SubjectId,
		    	SubjectName : bodyts[count].SubjectName
		    	
		    	
		    };
		    TimeSlotList.push(timeslot);
		}
    }
	return TimeSlotList;
}

function toStudentTimeTableDays(bodydays)
{
	var Days = [];
	var count=0;
	if(bodydays !== undefined)
		{
		  for(count=0; count < bodydays.length; count++)
			  {
			    var days = {
			    		Day: bodydays[count].Day,
			    		TimeSlots: toStudentTimeSlotList(bodydays[count].TimeSlots)
			    };
			    Days.push(days);
			  }
		}
	return Days;
}

function toStudentTimeTable(body, StudentTimeTable) {
	var studenttimetable =  new StudentTimeTable(
	{
		ClassStandard: body.ClassStandard,
		SchoolId: body.SchoolId,
		
		Days: toStudentTimeTableDays(body.Days)
		
	});

	return studenttimetable; 
	}

function toTeacherTimeSlotList(bodyts)
	{
		var TimeSlotList = [];
		var count=0;
		if(bodyts !==undefined)
	    {
		for(count =0; count <bodyts.length; count++)
			{
			    var timeslot = {
	                        ClassStandard: bodyts[count].ClassStandard,
			    	StartTime : bodyts[count].StartTime,
			    	EndTime : bodyts[count].EndTime,
			    	PeriodNumber:  bodyts[count].PeriodNumber,
			    	SubjectId : bodyts[count].SubjectId,
			    	SubjectName : bodyts[count].SubjectName
			    	
			    	
			    };
			    TimeSlotList.push(timeslot);
			}
	    }
		return TimeSlotList;
	}

function toTeacherTimeTableDays(bodydays)
{
	var Days = [];
	var count=0;
	if(bodydays !== undefined)
		{
		  for(count=0; count < bodydays.length; count++)
			  {
			    var days = {
			    		Day: bodydays[count].Day,
			    		TimeSlots: toTeacherTimeSlotList(bodydays[count].TimeSlots)
			    };
			    Days.push(days);
			  }
		}
	return Days;
	
}

function toTeacherTimeTable(body, TeacherTimeTable) 
{
		
	var teachertimetable =  new TeacherTimeTable(
	{
		TeacherId: body.TeacherId,
		SchoolId: body.SchoolId,
		
		Days: toTeacherTimeTableDays(body.Days)
		
	});
	
	return teachertimetable;
	
}

exports.updateStudentswithIsApp = function (Student, request, response)
{
   var conditions = {},
    update = { IsAppInstalled: false },
    options = { multi: true };

Student.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
});
};

exports.updateTeacherswithIsApp = function (request, response)
{
	var conditions = {},
    update = { IsAppInstalled: false },
    options = { multi: true };

Teacher.update(conditions, update, options,
function callback (err, numAffected) {
    // numAffected is the number of updated documents
});
}

exports.createStudent = function (model, requestBody, response)
{
	var Student = toStudent(requestBody, model);	
	model.count({},function(error, studentcount){
	if(!error){
	     Student.StudentId = (studentcount + 1)
	     if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	     {
		    Student.IsAppInstalled = requestBody.IsAppInstalled;
	     }
	Student.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('Student saved successfully');
	});
	}
	});
};

exports.findStudentById = function (model, _studentId, response) {
		model.findOne({StudentId: _studentId},
		function(error, result) {
		if (error) {
		console.error(error);
		response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
		} else {
		if (!result) {
		if (response != null) {
		response.writeHead(404, {'Content-Type' : 'text/plain'});
		response.end('Student Not Found');
		}
		return;
		}
		if (response != null){
		response.setHeader('Content-Type', 'application/json');
		response.send(result);
		}
		//console.log(result);
		}
		});
	}
	
exports.findStudentBySchoolId = function (model, _schoolid, response) {
	  model.find({SchoolId: _schoolid}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}

	

exports.listStudent = function (model, response) {
	model.find({}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
	}

exports.removeStudent = function (model, _studentId, response)
{
console.log('Deleting Student with Student Id: ' + _studentId);
model.findOne({StudentId: _studentId},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Student not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Student Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Student');
	}
	return;
	}
	}
	});
	}

exports.updateStudent = function (model, requestBody, response) {
	var studentId = requestBody.StudentId;
	model.findOne({StudentId: studentId},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var student = toStudent(requestBody, model);
	if (!data) {
	console.log('Student with StudentID: '+ studentId
	+ ' does not exist. The student will be created.');
	student.save(function(error) {
	if (!error)
		student.save();
	});
	if (response != null) {
	response.writeHead(201,
	{'Content-Type' : 'text/plain'});
	response.end('Created');
	}
	return;
	}
	//poulate the document with the updated values
	data.StudentId = student.StudentId;
	data.SchoolId = student.SchoolId;
	data.StudentFirstName = student.StudentFirstName;
	data.StudentMiddleName = student.StudentMiddleName;
	data.StudentLastName = student.StudentLastName;
	data.StudentDOB = student.StudentDOB;
	data.Age = student.Age;
	data.StudentGender = student.StudentGender;
	data.StudentClassStandard = student.StudentClassStandard;
	data.StudentFullAddress = student.StudentFullAddress;
	data.ParentList = student.ParentList;
	data.ImageUrl = student.ImageUrl;
	if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	{
		data.IsAppInstalled = requestBody.IsAppInstalled;
	}
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Student with student Id: '+ studentId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
	response.send('Updated');
	}
	}
	});
};

exports.AddOrUpdateStudent = function (model, requestBody) {
	var studentId = requestBody.StudentId;
	model.findOne({StudentId: studentId},
	function(error, data) {
	if (error) {
	console.log(error);
	return;
	} else {
	var student = toStudent(requestBody, model);
	if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	{
		student.IsAppInstalled = requestBody.IsAppInstalled;
	}
	if (!data) {
	console.log('Student with StudentID: '+ studentId
	+ ' does not exist. The student will be created.');
	student.save(function(error) {
	if (!error)
		{
		 student.save();
		}
	else
		{
		 console.log(error);
		}
	});
	
	console.log('Student Record Created');
	return;
	}
	//poulate the document with the updated values
	data.StudentId = student.StudentId;
	data.SchoolId = student.SchoolId;
	data.StudentFirstName = student.StudentFirstName;
	data.StudentMiddleName = student.StudentMiddleName;
	data.StudentLastName = student.StudentLastName;
	data.StudentDOB = student.StudentDOB;
	data.Age = student.Age;
	data.StudentGender = student.StudentGender;
	data.StudentClassStandard = student.StudentClassStandard;
	data.StudentFullAddress = student.StudentFullAddress;
	data.ParentList = student.ParentList;
	data.ImageUrl = student.ImageUrl;
	data.IsAppInstalled = student.IsAppInstalled ;
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Student with student Id: '+ studentId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	
	
	}
	});
};



exports.createTeacher = function (requestBody, response)
{
	var teach = toTeacher(requestBody, Teacher);	
	Teacher.count({},function(error, teachercount){
	if(!error){
	     teach.TeacherId = (teachercount + 1)
	     if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	     {
		    teach.IsAppInstalled = requestBody.IsAppInstalled;
	     }
	teach.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			}
		console.log('Teacher saved successfully');
	});	
	}
	});
};

exports.findTeacherById = function (_teacherId, response) {
	Teacher.findOne({TeacherId: _teacherId},
	function(error, result) {
	if (error) {
	console.error(error);
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	return;
	} else {
	if (!result) {
	if (response != null) {
	response.writeHead(404, {'Content-Type' : 'text/plain'});
	response.end('Teacher Not Found');
	}
	return;
	}
	if (response != null){
	response.setHeader('Content-Type', 'application/json');
	response.send(result);
	}
	//console.log(result);
	}
	});
}

exports.findTeacherBySchoolId = function (_schoolid, response) {
	Teacher.find({SchoolId: _schoolid }, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}


exports.listTeachers = function (response) {
	Teacher.find({}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}


exports.removeTeacher = function ( _teacherId, response)
{
console.log('Deleting Teacher with Teacher Id: ' + _teacherId);
Teacher.findOne({TeacherId: _teacherId},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Teacher not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Teacher Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Teacher');
	}
	return;
	}
	}
	});
	}

exports.updateTeacher = function (requestBody, response) {
	var TeacherId = requestBody.TeacherId;
	Teacher.findOne({TeacherId: TeacherId},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var teacher = toTeacher(requestBody, Teacher);
	if (!data) {
	console.log('Teacher with TeacherID: '+ TeacherId
	+ ' does not exist. The Teacher will be created.');
	teacher.save(function(error) {
	if (!error)
		teacher.save();
	});
	if (response != null) {
	response.writeHead(201,
	{'Content-Type' : 'text/plain'});
	response.end('Created');
	}
	return;
	}
	//poulate the document with the updated values
	data.TeacherId = teacher.TeacherId;
	data.SchoolId = teacher.SchoolId;
	data.TeacherFirstName = teacher.TeacherFirstName;
	data.TeacherMiddleName = teacher.TeacherMiddleName;
	data.TeacherLastName = teacher.TeacherLastName;
	data.TeacherDOB = teacher.TeacherDOB;
	data.Age = teacher.Age;
	data.TeacherGender = teacher.TeacherGender;
	data.TeacherFullAddress = teacher.TeacherFullAddress;
	data.MobileNumber = teacher.MobileNumber;
	data.AlternateMobNumber = teacher.AlternateMobNumber;
	data.EmailId = teacher.EmailId;
	data.AlternateEmailID = teacher.AlternateEmailID;
	data.PresentAddress = teacher.PresentAddress;
	data.PresentAddressPOBox = teacher.PresentAddressPOBox;
	data.PermanentAddress = teacher.PermanentAddress;
	data.PermanentAddressPOBox = teacher.PermanentAddressPOBox;
	data.Messages = teacher.Messages;
	data.TeacherRoleList = teacher.TeacherRoleList;
	data.ImageUrl = teacher.ImageUrl;
	if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	{
		data.IsAppInstalled = requestBody.IsAppInstalled;
	}
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Teacher with Teacher Id: '+ TeacherId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
	response.send('Updated');
	}
	}
	});
};

exports.AddOrUpdateTeacher = function (model, requestBody) {
	var TeacherId = requestBody.TeacherId;
	model.findOne({TeacherId: TeacherId},
	function(error, data) {
	if (error) {
	console.log(error);
	return;
	} else {
	var teacher = toTeacher(requestBody, model);
	if(requestBody !=undefined && requestBody.IsAppInstalled !=undefined)
	{
		teacher.IsAppInstalled = requestBody.IsAppInstalled;
	}
	if (!data) {
	console.log('Teacher with TeacherID: '+ TeacherId
	+ ' does not exist. The Teacher will be created.');
	teacher.save(function(error) {
	if (!error)
		{
		 teacher.save();
		}
	else
		{
		 console.log(error);
		}
	});
	
	console.log('Teacher Record Created');
	return;
	}
	//poulate the document with the updated values
	data.TeacherId = teacher.TeacherId;
	data.SchoolId = teacher.SchoolId;
	data.TeacherFirstName = teacher.TeacherFirstName;
	data.TeacherMiddleName = teacher.TeacherMiddleName;
	data.TeacherLastName = teacher.TeacherLastName;
	data.TeacherDOB = teacher.TeacherDOB;
	data.Age = teacher.Age;
	data.TeacherGender = teacher.TeacherGender;
	data.TeacherFullAddress = teacher.TeacherFullAddress;
	data.MobileNumber = teacher.MobileNumber;
	data.AlternateMobNumber = teacher.AlternateMobNumber;
	data.EmailId = teacher.EmailId;
	data.AlternateEmailID = teacher.AlternateEmailID;
	data.PresentAddress = teacher.PresentAddress;
	data.PresentAddressPOBox = teacher.PresentAddressPOBox;
	data.PermanentAddress = teacher.PermanentAddress;
	data.PermanentAddressPOBox = teacher.PermanentAddressPOBox;
	data.Messages = teacher.Messages;
	data.TeacherRoleList = teacher.TeacherRoleList;
	data.ImageUrl = teacher.ImageUrl;
	data.IsAppInstalled = teacher.IsAppInstalled;
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Teacher with Teacher Id: '+ TeacherId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	
	
	}
	});
};



exports.createEvents = function (Model, requestBody, response)
{
	Model.count({},function(error, eventscount){
	if(!error){
	var events = new Model(
			{
				EventId: (eventscount + 1),
				EventName : requestBody.EventName,
				EventDate: requestBody.EventDate,
				EventPlace: requestBody.EventPlace,
				EventStartTime: requestBody.EventStartTime,
				EventEndTime: requestBody.EventEndTime,
				EventDescription: requestBody.EventDescription,
				SchoolId: requestBody.SchoolId,
				TeacherIdS: requestBody.TeacherIdS,
				StudentIDS:	requestBody.StudentIDS
			});
	
	events.save(function(err){
		if (err)
			{
			  console.log(err);
			  response.end(err);
			}
		else
			{
			response.end('Events saved successfully');
		console.log('Events saved successfully');
			}
	});
	}
	});
};

exports.listEvents = function (model, response) {
	model.find({}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response !== null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
	};
	
exports.listEventsForSchool = function (model, _schoolid,response) {
		model.find({SchoolId: _schoolid}, function(error, result) {
		if (error) {
		console.error(error);
		return null;
		}
		if (response !== null) {
		response.setHeader('content-type', 'application/json');
		response.end(JSON.stringify(result));
		}
		return JSON.stringify(result);
		});
		};


exports.createStudentTimeTableForClassStandard = function (model, requestBody, response)
{
	var Studenttimetable = toStudentTimeTable(requestBody, model);	
	Studenttimetable.save(function(err){
		if (err)
			{
			  console.log(err);
			  response.end(err);
			}
		else
			{
			response.end('Student Time Table saved successfully');
		console.log('Student Time Table saved successfully');
			}
	});
};

exports.findStudentTimeTableByStudentId = function (model,Student, _studentId, response) {
	Student.findOne({StudentId: _studentId},
		function(error, result) {
		if (error) {
		console.error(error);
		response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
		} else {
		if (!result) {
		if (response != null) {
		response.writeHead(404, {'Content-Type' : 'text/plain'});
		response.end('Student Not Found');
		}
		return;
		}
		if (response != null){

                var classstnd = result.StudentClassStandard;
                model.findOne({ClassStandard: classstnd},
                function(err, res)
                 {
                   if(err)
                    {
                      console.log(err);
                      response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
                    }
                    else
                    {
                      
                       response.setHeader('Content-Type', 'application/json');
					   if(res != null)
					   {
		                    response.send(res);
					   }
					   else
					   {
                          response.send(defaultStudentTimeTable(model,result));
					   }

                    }
                 
                 });

		
		}
		//console.log(result);
		}
		});
		}

exports.findStudentTimeTableByClassStandard = function (model, _ClassStandard, response) {
		model.findOne({ClassStandard: _ClassStandard},
		function(error, result) {
		if (error) {
		console.error(error);
		response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
		} else {
		if (!result) {
			console.log("inside no result");
		if (response != null) {
			response.setHeader('Content-Type', 'application/json');
		response.send(defaultStudentTimeTable(model,result));
		}
		return;
		}
		if (response != null){
		response.setHeader('Content-Type', 'application/json');
		console.log(result);
		if(result !=null && result.ClassStandard !=undefined)
		{
			console.log("inside result");
		response.send(result);
	    }
		else
		{
			console.log("default result");
			response.send(defaultStudentTimeTable(model,result));
		}
	
		}
		//console.log(result);
		}
		});
		}

function defaultTeacherTimeTable(TeacherTimeTable, result)
{
	var tid = "";
	if(result !=null &&  result !=undefined && result.TeacherId !=undefined)
	{
		tid = result.TeacherId;
	}
	var sid = "";
	if(result !=null && result !=undefined && result.SchoolId !=undefined)
	{
		sid = result.SchoolId;
	}
   var resp = new TeacherTimeTable(
	   {
          TeacherId: "",
		  SchoolId: "",

		  Days: [
										    {
												Day: "Monday",
												TimeSlots: [
													         {
																 ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Tuesday",
												TimeSlots: [
													         {
																  ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Wednesday",
												TimeSlots: [
													         {
																  ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Thursday",
												TimeSlots: [
													         {
																  ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Friday",
												TimeSlots: [
													         {
																 ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Saturday",
												TimeSlots: [
													         {
																 ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Sunday",
												TimeSlots: [
													         {
																  ClassStandard: "",
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											}

									      ]

	   }
   );
   
   return JSON.stringify(resp);
}

function defaultStudentTimeTable(StudentTimeTable, result)
{
	var classstd  = "";
	if(result != null && result !=undefined && result.StudentClassStandard !=undefined)
	{
         classstd = result.StudentClassStandard;
	}
	var schid = "";
	if(result != null && result !=undefined && result.SchoolId !=undefined)
	{
       schid = result.SchoolId;
	}
  

  var resp = new StudentTimeTable({
                                    ClassStandard: classstd,
									SchoolId: schid,
									Days: [
										    {
												Day: "Monday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Tuesday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Wednesday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Thursday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Friday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Saturday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											},
											{
												Day: "Sunday",
												TimeSlots: [
													         {
																 StartTime: "",
																 EndTime: "",
																 PeriodNumber: "",
																 TeacherId: "",
																 TeacherName: "",
																 SubjectId: "",
																 SubjectName: "",
															 }
												           ]
											}

									      ]
						  });
                         
						 return JSON.stringify(resp);

}

exports.listStudentTimeTableForAllClass = function (model, response) {
	model.find({}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	if(result !=null && result.length !=undefined && result.length > 0)
	{
	  response.end(JSON.stringify(result));
    }
    else
    {
	  response.end(defaultTeacherTimeTable(model,result));
    }
   }
    if(result !=null && result.length !=undefined && result.length > 0)
	{
       return JSON.stringify(result);
	}
	else
	{
	    return defaultStudentTimeTable(model,result);
	}
	});
	}

exports.removeStudentTimeTableForClassStandard = function (model, _ClassStandard, response){
console.log('Deleting Student with Student Id: ' + _studentId);
model.findOne({ClassStandard: _ClassStandard},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Time Table for this class Not Found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Time Table for this class Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Student Time Table');
	}
	return;
	}
	}
	});
	}

exports.updateStudentTimeTableForClassStandard = function (model, requestBody, response) {
	var classstandard = requestBody.ClassStandard;
	model.findOne({ClassStandard: classstandard},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var studenttimetable = toStudentTimeTable(requestBody, model);
	
	if (!data) {
	console.log('Student Time Table For Class: '+ classstandard 
	+ ' does not exist. The student Time Table will be created.');
	studenttimetable.save(function(error) {
	if (!error)
	{
		studenttimetable.save();
	}
	else
	{
		console.log(error);
	}
	});
	if (response != null) {
	response.writeHead(201,
	{'Content-Type' : 'text/plain'});
	response.end('Created');
	}
	return;
	}
	//poulate the document with the updated values
	data.ClassStandard = studenttimetable.ClassStandard;
	data.SchoolId = studenttimetable.SchoolId;
	data.Days = studenttimetable.Days;
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Student Time Table for Class : '+ classstandard);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
	response.send('Updated');
	}
	}
	});
};


exports.createTeacherTimeTable = function (model, requestBody, response)
{
	var TeachertimeTable = toTeacherTimeTable(requestBody, model);
	TeachertimeTable.save(function(err){
		if (err)
			{
			console.log(err);
			response.end(err);
			}
		else
			{
			response.end('Teacher Time Table saved successfully');
		console.log('Teacher Time Table saved successfully');
			}
	});
}

exports.findTeacherTimeTableByTeacherId = function (model, _teacherId, response) {
	model.findOne({TeacherId: _teacherId},
	function(error, result) {
	if (error) {
	console.error(error);
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	return;
	} else {
	if (!result) {
	if (response != null) {
	response.setHeader('Content-Type', 'application/json');
	response.send(defaultTeacherTimeTable(model,result));
	}
	return;
	}
	if (response != null){
	response.setHeader('Content-Type', 'application/json');
	if(result !=null && result.TeacherId != undefined)
	{
	response.send(result);
    }
	else
	{
		response.send(defaultTeacherTimeTable(model,result));
	}

	}
	//console.log(result);
	}
	});
	}

exports.listTeachersTimeTable = function (model, response) {
	model.find({}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	if(result !=null && result.length !=undefined && result.length > 0)
	{
	   response.end(JSON.stringify(result));
    }
	else
	{
		response.end(defaultTeacherTimeTable(model,result));
	}

}
    if(result !=null && result.length !=undefined && result.length > 0)
	{
	return JSON.stringify(result);
}
else
{
	 defaultTeacherTimeTable(model,result);
}
	});
	}

exports.removeTeacherTimeTable = function (model, _teacherId, response)
{
console.log('Deleting Teacher Time Table with Teacher Id: ' + _teacherId);
model.findOne({TeacherId: _teacherId},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Teacher not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Teacher Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Teacher Time Table');
	}
	return;
	}
	}
	});
	}

exports.updateTeacherTimeTable = function (model, requestBody, response) {
	var TeacherId = requestBody.TeacherId;
	model.findOne({TeacherId: TeacherId},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var teacher = toTeacherTimeTable(requestBody, model);
	if (!data) {
	console.log('Teacher with TeacherID: '+ TeacherId
	+ ' does not exist. The Teacher will be created.');
	teacher.save(function(error) {
	if (!error)
		teacher.save();
	});
	if (response != null) {
	response.writeHead(201,
	{'Content-Type' : 'text/plain'});
	response.end('Created');
	}
	return;
	}
	//poulate the document with the updated values
	data.TeacherId = teacher.TeacherId;
	data.SchoolId = teacher.SchoolId;
	data.Days = teacher.Days;
	
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Teacher Time Table with Teacher Id: '+ TeacherId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
	response.send('Updated');
	}
	}
	});
};

exports.createClass = function (Class, requestBody, response)
{
	var clas = new Class({
		Class: requestBody.Class,
		Section: requestBody.Section,
		ClassSection: requestBody.Class + requestBody.Section,
		SchoolId : requestBody.SchoolId
	});	
	clas.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
            response.json({"code" : 101, "status" : "Error in creating Record " + err});
			}
		response.json({"code" : 200, "status" : "Class Record saved successfully"});
	});
};

exports.createSubject = function (Subject, requestBody, response)
{
	var subj = new Subject({
		Subject: requestBody.Subject,
		SubjectCode: requestBody.SubjectCode,
		SchoolId: requestBody.SchoolId
		
	});	
	subj.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
			response.json({"code" : 101, "status" : "Error in creating Record " + err});
			}
		console.log('Subject Record saved successfully');
		response.json({"code" : 200, "status" : "Subject Record saved successfully"});
	});
};	


exports.updateClass = function (Class, requestBody, response) {
	var clsSection = requestBody.Class + requestBody.Section;
	Class.findOne({ClassSection: clsSection},
	function(error, data) {
	if (error) {
	console.log(error);
	
	return;
	} else {
	var clas = new Class({
		Class: requestBody.Class,
		Section: requestBody.Section,
		ClassSection: requestBody.Class + requestBody.Section,
		SchoolId: requestBody.SchoolId
	});
	if (!data) {
		console.log("inside create");
	console.log('Class with ClassSection: '+ clsSection
	+ ' does not exist. The Class will be created.');
	clas.save(function(err){
		if (err)
			{
			//throw err;
			console.log(err);
            //response.json({"code" : 101, "status" : "Error in creating Record " + err});
			}
		//response.json({"code" : 200, "status" : "Class Record saved successfully"});
	});
	
	return;
	}
	//poulate the document with the updated values
	data.Class = requestBody.Class;
	data.Section = requestBody.Section;
	data.ClassSection = requestBody.Class + requestBody.Section;
	data.SchoolId = requestBody.SchoolId;
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Class with Section: '+ clsSection);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	
	}
	});
};

exports.updateSubject = function (Subject, requestBody, response) {
	var sub = requestBody.Subject ;
	Subject.findOne({Subject: sub},
	function(error, data) {
	if (error) {
	console.log(error);
	
	return;
	} else {
	var subject = new Subject({
		Subject: requestBody.Subject,
		SubjectCode: requestBody.SubjectCode,
		SchoolId: requestBody.SchoolId
		
	});
	if (!data) {
	console.log('Subject with Name: '+ sub
	+ ' does not exist. The Subject will be created.');
	subject.save(function(error) {
	if (error)
		console.log(error);
	});
	
	return;
	}
	//poulate the document with the updated values
	data.Subject = requestBody.Subject;
	data.SubjectCode = requestBody.SubjectCode;
	data.SchoolId = requestBody.SchoolId;
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated Subject with Name: '+ sub);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	
	}
	});
};

exports.getAllClass = function (model, _SchoolId, response) {
	model.find({SchoolId: _SchoolId}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}


exports.getAllSubject = function (model, _SchoolId, response) {
	model.find({SchoolId: _SchoolId}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}	


exports.getClassByClassSection = function (model, _Section, SchoolId, response) {
		model.findOne({ClassSection: _Section, SchoolId: _SchoolId},
		function(error, result) {
		if (error) {
		console.error(error);
		response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
		} else {
		if (!result) {
		if (response != null) {
		response.writeHead(404, {'Content-Type' : 'text/plain'});
		response.end('Class Section Not Found');
		}
		return;
		}
		if (response != null){
		response.setHeader('Content-Type', 'application/json');
		response.send(result);
		}
		//console.log(result);
		}
		});
	}
	
		
exports.getClassByName = function (model, _Name, _SchoolId, response) {
	model.find({Class: _Name, SchoolId: _SchoolId}, function(error, result) {
	if (error) {
	console.error(error);
	return null;
	}
	if (response != null) {
	response.setHeader('content-type', 'application/json');
	response.end(JSON.stringify(result));
	}
	return JSON.stringify(result);
	});
}

		
exports.getSubjectByName = function (model, _Name, _SchoolId, response) {
		model.findOne({Subject: _Name, SchoolId: _SchoolId},
		function(error, result) {
		if (error) {
		console.error(error);
		response.writeHead(500,
		{'Content-Type' : 'text/plain'});
		response.end('Internal server error');
		return;
		} else {
		if (!result) {
		if (response != null) {
		response.writeHead(404, {'Content-Type' : 'text/plain'});
		response.end('Subject Not Found');
		}
		return;
		}
		if (response != null){
		response.setHeader('Content-Type', 'application/json');
		response.send(result);
		}
		//console.log(result);
		}
		});
	}
			
		
exports.deleteClassByClassSection = function (model, _Section, _SchoolId, response)
{
console.log('Deleting Class with ClassSection: ' + _Section);
model.findOne({ClassSection: _Section, SchoolId: _SchoolId},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Class not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Class Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Class');
	}
	return;
	}
	}
	});
}

exports.deleteSubjectByName = function (model, _Name, _SchoolId, response)
{
console.log('Deleting Subject with SubjectName: ' + _Name);
model.findOne({Subject: _Name, SchoolId: _SchoolId},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Subject not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Subject Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Subject');
	}
	return;
	}
	}
	});
}

exports.removeEvents = function (model, _EventID, response)
{
console.log('Deleting Event with Event Id: ' + _EventID);
model.findOne({EventId: _EventID},
function(error, data) {
if (error) {
console.log(error);
if (response != null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('Event not found');
if (response != null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('Event Not Found');
}
return;
} else {
data.remove(function(error){
if (!error) {
data.remove();
}
else {
console.log(error);
}
});
if (response != null){
	response.send('Deleted Event');
	}
	return;
	}
	}
	});
	}


exports.updateEvents = function (Model, requestBody, response) {
	var eventId = requestBody.EventId;
	Model.findOne({EventId: eventId},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response != null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var teacher = toTeacher(requestBody, Teacher);
	if (!data) {
	
	
	
	return;
	}
	//poulate the document with the updated values
	data.EventId = requestBody.EventId;
	data.EventName = teacher.SchoolId;
	data.EventDate = teacher.TeacherFirstName;
	data.EventPlace = teacher.TeacherMiddleName;
	data.EventStartTime = teacher.TeacherLastName;
	data.EventEndTime = teacher.TeacherDOB;
	data.EventDescription = teacher.Age;
	data.SchoolId = teacher.TeacherGender;
	data.TeacherIdS = teacher.TeacherFullAddress;
	data.StudentIDS = teacher.MobileNumber;
	
	
	// now save
	data.save(function (error) {
	if (!error) {
	
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response != null) {
	response.send('Updated');
	}
	}
	});
};
		


