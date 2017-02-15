
require('../app_api/models/school');
var mongoose = require('mongoose');
var School = mongoose.model('School');


function toSchool(request,body) {
var school =  new School(
{
	
	SchoolId: body.SchoolId,
	SchoolFullName: body.SchoolFullName,
	SchoolFullAddress: body.SchoolFullAddress,
	SchoolMainTelephoneNumber: body.SchoolMainTelephoneNumber,
	AdditionalContactNumbers: body.AdditionalContactNumbers,
	SchoolWebSite: body.SchoolWebSite,
	SchoolCity: body.SchoolCity,
	SchoolState: body.SchoolState,
	SchoolAddressPOBox: body.SchoolAddressPOBox,
	SchoolDistrict: body.SchoolDistrict,
	SchoolType: body.SchoolType,
	ImageUrl: request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Large_"+ body.SchoolId +".jpg",
	ImageUrlLogo: request.protocol + '://' + request.get('host') + "/uploadTeacherOrStudentImage/" + "School_Logo_"+ body.SchoolId +".jpg"
	
});

return school;
}

exports.createSchool = function (model,request, requestBody, response)
{
	var school = toSchool(request,requestBody);
	
	school.save(function(err){
		if (err)
			{
			 console.log(err);
			}
		console.log('school saved successfully');
		response.end('school saving message');
	});
};

exports.findSchoolbyId = function (model, _schoolId, response) {
	School.findOne({SchoolId: _schoolId},
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
	response.end('School Not Found');
	}
	return;
	}
	if (response !== null){
	response.setHeader('Content-Type', 'application/json');
	response.send(result);
	}
	//console.log(result);
	}
	});
	};

exports.listSchools = function (model, response) {
	School.find({}, function(error, result) {
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

exports.deleteSchool = function (model, _schoolId, response)
{
console.log('Deleting School with : ' + _schoolId);
model.findOne({SchoolId: _schoolId},
function(error, data) {
if (error) {
console.log(error);
if (response !== null) {
response.writeHead(500, {'Content-Type' : 'text/plain'});
response.end('Internal server error');
}
return;
} else {
if (!data) {
console.log('School not found');
if (response !== null) {
response.writeHead(404,
{'Content-Type' : 'text/plain'});
response.end('School Not Found');
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
if (response !== null){
	response.send('Deleted School');
	}
	return;
	}
	}
	});
	};

exports.updateSchool = function (model,request, requestBody, response) {
	var schoolId = requestBody.SchoolId;
	School.findOne({SchoolId: schoolId},
	function(error, data) {
	if (error) {
	console.log(error);
	if (response !== null) {
	response.writeHead(500,
	{'Content-Type' : 'text/plain'});
	response.end('Internal server error');
	}
	return;
	} else {
	var school = toSchool(request,requestBody, model);
	if (!data) {
	console.log('School Id: '+ schoolId + ' does not exist. The School will be created.');
	school.save(function(error) {
	if (!error)
		{
		school.save();
		}
	});
	if (response !== null) {
	response.writeHead(201,
	{'Content-Type' : 'text/plain'});
	response.end('Created');
	}
	return;
	}
	//poulate the document with the updated values
	data.SchoolId = school.SchoolId;
	data.SchoolFullName = school.SchoolFullName;
	data.SchoolFullAddress = school.SchoolFullAddress;
	data.SchoolMainTelephoneNumber = school.SchoolMainTelephoneNumber;
	data.AdditionalContactNumbers = school.AdditionalContactNumbers;
	data.SchoolWebSite = school.SchoolWebSite;
	data.SchoolCity = school.SchoolCity;
	data.SchoolState = school.SchoolState;
	data.SchoolAddressPOBox = school.SchoolAddressPOBox;
	data.SchoolDistrict = school.SchoolDistrict;
	data.SchoolType = school.SchoolType;
	data.ImageUrl = school.ImageUrl;
	data.ImageUrlLogo = school.ImageUrlLogo;
	
	
	
	// now save
	data.save(function (error) {
	if (!error) {
	console.log('Successfully updated school with school Id: '+ schoolId);
	data.save();
	} else {
	console.log('error on save');
	}
	});
	if (response !== null) {
	response.send('Updated');
	}
	}
	});
};

exports.findSchoolBySchoolFullName = function (model, SchoolName, response){
	model.find({SchoolFullName: SchoolName}, function(error, result) {
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
