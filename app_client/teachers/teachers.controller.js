(function () {

  angular
    .module('handbook')
    .controller('teacherCtrl', teacherCtrl);

  teacherCtrl.$inject= ['$location','handbookData','messaging'];  
  
  function teacherCtrl($location,handbookData,messaging) {
    var vm = this;
    vm.selectedAll=false;
    vm.schoolId=100;  
    vm.selectedIds = {"002": true,"003":false};
    vm.selectedTeacher =[];
    
    vm.pageHeader = {
      title: 'Teachers'
    };

    vm.sendMessage=function(){
        
      for (var i = 0, l = vm.teachers.length; i < l; i++) {
        
        if(vm.teachers[i].selected){
          messaging.addtoMessageList({
            Name:vm.teachers[i].TeacherFirstName,
            MobileNumber:vm.teachers[i].MobileNumber,
            Id:vm.teachers[i].TeacherId
        });
        }
      }
      
      $location.path("/messages")  

    };

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.teachers,function(teacher){
        teacher.selected=vm.selectedAll;
      })

    }

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
    
    vm.edit= function(teacher){
      handbookData.setSelectedTeacher(teacher);
      $location.path("/teachers/edit");
    };
    
    vm.teacherProfile=function(teacher){
      handbookData.setSelectedTeacher(teacher);
      $location.path("/teachers/edit");
    }

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