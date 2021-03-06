(function () {

  angular
    .module('handbook')
    .controller('studentCtrl', studentCtrl);

  studentCtrl.$inject= ['$location','$filter','handbookData','messaging','authentication'];  
  function studentCtrl($location,$filter,handbookData,messaging,authentication) {
    var vm = this;
    vm.schoolId=authentication.schoolId().schoolId;;  
    vm.loading = true;
    vm.selectedIds = {"002": true,"003":false};
    vm.classes=[];
    vm.filteredStudents=[];
    vm.filterOnAppNotInstalled =false;
    vm.selectedClass="";
    vm.pageHeader = {
      title: 'Students'
    };
    var allClass= {};
    allClass.ClassSection="All";

    vm.classChanged=function(){
      if(vm.selectedClass===allClass.ClassSection || vm.selectedClass==="")
      {
         vm.filteredStudents=vm.students; 
      }
      else{
        vm.filteredStudents = $filter('filter')(vm.students,{StudentClassStandard:vm.selectedClass},true);
      }
    }
    vm.appFilterChanged=function(){

      vm.filteredStudents = $filter('filter')(vm.filteredStudents,{IsAppInstalled:!vm.filterOnAppNotInstalled});
      
    }

    vm.filterData=function(){
      vm.classChanged();
      vm.appFilterChanged();
    }

    vm.checkAll=function(){

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

    vm.sendTextMessage=function(){

      var textToStudentList=[];
      for (var i = 0, l = vm.filteredStudents.length; i < l; i++) {
        if(vm.students[i].selected){
          for(var j=0; j<vm.students[i].StudentParentMobiles.length;j++)
          {
            textToStudentList.push(vm.students[i].StudentParentMobiles[j]);
          }
        }
      }
      var messageJsonObject={};
      messageJsonObject.MobileNumbers=textToStudentList;
      messaging.sendTextMessage(messageJsonObject);
        

    }  


    vm.addStudent = function(){

      handbookData.setStudentPageMode("Add");
      $location.path("/students/edit");
      console.log(vm.selectedIds);
    };

    vm.edit= function(student){
      handbookData.setSelectedStudent(student);
      handbookData.setStudentPageMode("Edit");
      $location.path("/students/edit");
    };

    vm.remove=function(student,index){
      handbookData.deleteStudent(student.StudentId)
      .success(function(result){
          alert("Student deleted successfully");  
          //Delete student from the currently loaded students 
          vm.students.splice(index,1);
        })
      .error(function(e){
          console.log(e);
          alert("Failed to update record. Please try again");

      });
    }

    vm.delete=function(student){
      handbookData.deleteStudent(student.StudentId)
      .success(function(result){
          console.log("Student deleted successfully");  
         // vm.students.splice(index,1);
        })
      .error(function(e){
          console.log(e);
          alert("Failed to update record. Please try again");

      });
    }

    vm.deleteStudent=function(){
      for (var i = 0, l = vm.filteredStudents.length; i < l; i++) {
        
        if(vm.students[i].selected){
          vm.delete(vm.students[i]);
        }
      }
      
    };

    vm.studentProfile=function(student){
      handbookData.setSelectedStudent(student);
      handbookData.setStudentPageMode("View");
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
    })
    .finally(function(){
      vm.loading = false;
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