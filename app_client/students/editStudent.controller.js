(function () {

  angular
    .module('handbook')
    .controller('editStudentCtrl', editStudentCtrl);

    editStudentCtrl.$inject= ['$location','handbookData','messaging'];  
    function editStudentCtrl($location,handbookData,messaging) {
  
      
        var vm = this;
        vm.myFile={};
        vm.uploadCompleted=false;
        vm.student = handbookData.getSelectedStudent();
        vm.StudentDOB = formatDOB(vm.student.StudentDOB)
        vm.loading=false;
        vm.pageHeader = {
          title: 'Edit Student'
        };

        var formatDOB=function(birthDate){
          var date = new Date(birthDate);
          year = date.getFullYear();
          month = date.getMonth()+1;
          dt = date.getDate();

          if (dt < 10) {
            dt = '0' + dt;
          }
          if (month < 10) {
            month = '0' + month;
          }
          var fomattedDate =dt+"/"+month+"/"+year;
          return fomattedDate;
        }

        vm.onSubmit=function(){
          vm.student.StudentDOB =vm.StudentDOB;
          handbookData.updateStudent(vm.student)
            .success(function(result){
              alert("Record updated successfully");  
              $location.path("/students");
            })
            .error(function(e){
               console.log(e);
               alert("Failed to update record. Please try again");

          });
        }

        vm.uploadFile=function(event){
            vm.loading=true;
            console.log("Image file to upload"+ event.target.files[0]);
            var uploadedUrl= handbookData.uploadFile(vm.myFile,'/uploadTeacherOrStudentImage');
            uploadedUrl.then(function(result){
              console.log("Upload image completed"+result);
              console.log("Uploaded Image url" + result.ImageUrl);
              vm.student.ImageUrl = result.ImageUrl;
              vm.loading=false;    

          });
          
          
        }

    }
})();
  
