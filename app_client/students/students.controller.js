(function () {

  angular
    .module('handbook')
    .controller('studentCtrl', studentCtrl);

  studentCtrl.$inject= ['handbookData'];  
  function studentCtrl(handbookData) {
    var vm = this;
    vm.schoolId=100;  
    vm.selectedIds = {"002": true,"003":false};
    
    vm.pageHeader = {
      title: 'Students'
    };

    vm.addStudent = function(){
      console.log(vm.selectedIds);
    };

    vm.edit= function(student){
      handbookData.setSelectedStudent(student);
      $location.path("/students/edit");
    };

    vm.deleteStudents=function(){
        for(var studentId in vm.selectedIds){
            
            if(vm.selectedIds[studentId]){
              console.log("To be deleted" + studentId);
            }
        }
    };
    
    handbookData.getStudents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.students=data;
      }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });

  }

})();