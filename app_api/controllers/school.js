var schooldataservice = require('../../modules/schooldataservice');

module.exports.deleteSchool = function(request,response) {
	response.header("Access-Control-Allow-Origin", "*");
	response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log('request.params.SchoolId');
	console.log(request.params.SchoolId);
	schooldataservice.deleteSchool(request.params.SchoolId, response);
};
