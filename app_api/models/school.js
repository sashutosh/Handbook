var mongoose = require( 'mongoose' );
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


mongoose.model('School', SchoolSchema);