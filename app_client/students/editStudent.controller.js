(function () {

  angular
    .module('handbook')
    .controller('editStudentCtrl', editStudentCtrl);

    editStudentCtrl.$inject= ['$location','handbookData','messaging'];  
    function editStudentCtrl($location,handbookData,messaging) {
  
      
        var vm = this;
        vm.myFile={};
        vm.student = handbookData.getSelectedStudent();
        
        vm.pageHeader = {
          title: 'Edit Student'
        };

        vm.onSubmit=function(){
          //Step-1 Upload the myFile

          var uploadedUrl= handbookData.uploadFile(vm.myFile,'/uploadTeacherOrStudentImage');
          console.log("Upload image url"+datuploadedUrla);
          //Step-2 Make a post call to update the data

        }

    }
})();
  
