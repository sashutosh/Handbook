(function () {

  angular
    .module('handbook')
    .controller('editTeacherCtrl', editTeacherCtrl);

    editTeacherCtrl.$inject= ['$location','handbookData','messaging'];  
    function editTeacherCtrl($location,handbookData,messaging) {
  
      
      var vm = this;
      handbookData.getSelectedTeacher()
      .success(function(data){
          if(data){
              vm.teacher = data;
               vm.myFile={};
      vm.uploadCompleted=false;
      vm.loading=false;        
      vm.TeacherDOB = handbookData.formatDOB(vm.teacher.TeacherDOB);
      vm.pageHeader = {
        title: 'Edit Teacher'
      };
               
           }
      })
      .error(function(e){
            console.log(e);
            alert(e);
            vm.showButton =false;
          vm.pageHeader = {
            title: 'Edit Teacher'
          };
            //alert("School data not found");
         })
         .finally(function(){
      vm.loading = false;
    });
       
      
      
      vm.uploadFile=function(event){
            vm.loading=true;
            console.log("Image file to upload"+ event.target.files[0]);
            var uploadedUrl= handbookData.uploadFile(vm.myFile,'/uploadTeacherOrStudentImage');
            uploadedUrl.then(function(result){
              console.log("Upload image completed"+result);
              console.log("Uploaded Image url" + result.ImageUrl);
              vm.teacher.ImageUrl = result.ImageUrl;
              vm.loading=false;    

          });
          
          
        }

        vm.onSubmit=function(){
          vm.teacher.TeacherDOB =vm.TeacherDOB;
          handbookData.updateTeacher(vm.teacher)
            .success(function(result){
              alert("Record updated successfully");  
              $location.path("/teachers");
            })
            .error(function(e){
               console.log(e);
               alert("Failed to update record. Please try again");

          });
        }


    }
})();
  
