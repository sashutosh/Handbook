(function () {

  angular
    .module('handbook')
    .controller('teacherCtrl', teacherCtrl);

  teacherCtrl.$inject= ['$location','handbookData','messaging'];  
  
  function teacherCtrl($location,handbookData,messaging) {
    var vm = this;
    
    vm.schoolId=100;  
    vm.selectedIds = {"002": true,"003":false};
    vm.selectedTeacher =[];
    
    vm.pageHeader = {
      title: 'Teachers'
    };

    vm.sendMessage=function(){
        
      for(teacher in vm.selectedTeacher){
        messaging.addtoTeacherList(teacher);
      }
      
      $location.path("/messages")  

    };

    vm.onCheckBoxClick =function(teacherObj){
     
      var idx = vm.selectedTeacher.indexOf(teacherObj);

      // Is currently selected
      if (idx > -1) {
        vm.selectedTeacher.splice(idx, 1);
      }

      // Is newly selected
      else {
        vm.selectedTeacher.push(teacherObj);
      }
    }

    vm.addTeacher = function(){
      console.log(vm.selectedTeacher);
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