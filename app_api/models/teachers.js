var mongoose = require( 'mongoose' );

var TeacherRoleSchema = new mongoose.Schema({
	TeacherRole: String
});

var TeacherSchema = new mongoose.Schema({
	TeacherId: {type: String, required: true, unique: true },
	SchoolId: String,
	TeacherFirstName: {type: String, required: true},
	TeacherMiddleName: String,
	TeacherLastName: {type: String},
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
	IsAppInstalled : {type: Boolean, default: false},
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

mongoose.model('Teacher', TeacherSchema);
mongoose.model('TeacherType', TeacherRoleSchema);