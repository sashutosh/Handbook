(function () {

  angular
    .module('handbook')
    .controller('editStudentCtrl', editStudentCtrl);

    editStudentCtrl.$inject= ['$location','handbookData','messaging'];  
    function editStudentCtrl($location,handbookData,messaging) {
  
      
        var getDefaultStudent=function(){
          var student = {};
          student.StudentFirstName="";
          return student;
        }
        var vm = this;
        vm.myFile={};
        vm.uploadCompleted=false;

        vm.pagemode= handbookData.getStudentPageMode();
        if(vm.pagemode==="Edit"){
          vm.student = handbookData.getSelectedStudent();
          vm.pageHeader = {
            title: 'Edit Student'
          };
        }
        else if(vm.pagemode==="Add"){
          vm.student= getDefaultStudent();
          vm.pageHeader = {
            title: 'Add Student'
          };
        }
        
        vm.loading=false;
        

        
        vm.StudentDOB = handbookData.formatDOB(vm.student.StudentDOB);

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
  
