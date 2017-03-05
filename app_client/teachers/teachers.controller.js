(function () {

  angular
    .module('handbook')
    .controller('teacherCtrl', teacherCtrl);

  teacherCtrl.$inject= ['handbookData'];  
  function teacherCtrl(handbookData) {
    var vm = this;
    vm.schoolId=100;  
    vm.selectedIds = {"002": true,"003":false};
    
    vm.pageHeader = {
      title: 'Teachers'
    };

    vm.addTeacher = function(){
      console.log(vm.selectedIds);
    };

    vm.deleteTeacher=function(){
        for(var teacherId in vm.selectedIds){
            
            if(vm.selectedIds[teacherId]){
              console.log("To be deleted" + teacherId);
            }
        }
    };
    
    handbookData.getTeachers(vm.schoolId)
    .success(function(data){
      if(data){
        vm.teachers=data;
      }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });

  }

})();