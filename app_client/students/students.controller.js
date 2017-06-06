(function () {

  angular
    .module('handbook')
    .controller('studentCtrl', studentCtrl);

  studentCtrl.$inject= ['$location','$filter','handbookData','messaging','authentication'];  
  function studentCtrl($location,$filter,handbookData,messaging,authentication) {
    var vm = this;
    vm.schoolId=authentication.schoolId().schoolId;;  
    vm.selectedIds = {"002": true,"003":false};
    vm.classes=[];
    vm.filteredStudents=[];
    vm.selectedClass="";
    vm.pageHeader = {
      title: 'Students'
    };
    var allClass= {};
    allClass.ClassSection="All";

    vm.classChanged=function(){
      if(vm.selectedClass===allClass.ClassSection)
      {
         vm.filteredStudents=vm.students; 
      }
      else{
        vm.filteredStudents = $filter('filter')(vm.students,{StudentClassStandard:vm.selectedClass});
      }
    }

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.filteredStudents,function(student){
        student.selected=vm.selectedAll;
      })

    }

    vm.sendMessage=function(){
        
      for (var i = 0, l = vm.filteredStudents.length; i < l; i++) {
        
        if(vm.students[i].selected){
          messaging.addtoMessageList({
            Name:vm.students[i].StudentFirstName,
            MobileNumber:vm.students[i].StudentParentMobiles,
            Id:vm.students[i].StudentId
        });
        }
      }
      
      $location.path("/messages")  

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

    vm.studentProfile=function(student){
      handbookData.setSelectedStudent(student);
      $location.path("/students/edit");
    }
    
    handbookData.getStudents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.students=data;
        vm.filteredStudents=vm.students;
      }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });

    handbookData.getClasses(vm.schoolId)
    .success(function(data){
      if(data){
        vm.classes=data;
        vm.classes.push(allClass);
        //updateClasses(vm.classes); 
      }
    });

    var updateClasses=function(classes){
        
        for(var i=0;i<vm.classes.length;i++){
            vm.classes[i].label= vm.classes[i].ClassSection;
        }
    }

  }

})();