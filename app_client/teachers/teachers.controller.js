(function () {

  angular
    .module('handbook')
    .controller('teacherCtrl', teacherCtrl);

  teacherCtrl.$inject= ['$location','handbookData','messaging','authentication'];  
  
  function teacherCtrl($location,handbookData,messaging,authentication) {
    var vm = this;
    vm.selectedAll=false;
    vm.schoolId=authentication.schoolId().schoolId;  
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
      
      //handbookData.setSelectedTeacher(teacher);
      handbookData.setTeacherPageMode("Add");
      $location.path("/teachers/edit");
      console.log("Add teacher selected");
    };
    
    vm.edit= function(teacher){
      handbookData.setSelectedTeacher(teacher);
      $location.path("/teachers/edit");
    };

    vm.remove=function(teacher,index){
      handbookData.deleteTeacher(teacher.TeacherId)
      .success(function(result){
          alert("Teacher deleted successfully");  
          //Delete student from the currently loaded students 
          vm.teacherss.splice(index,1);
        })
      .error(function(e){
          console.log(e);
          alert("Failed to update record. Please try again");

      });
    }
    
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