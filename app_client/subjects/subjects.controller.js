(function () {

  angular
    .module('handbook')
    .controller('subjectCtrl', subjectCtrl);
  subjectCtrl.$inject= ['handbookData','authentication','$location'];  

  function subjectCtrl(handbookData,authentication,$location) {
    var vm = this;
    var newlyAddedSubjectsList =[];
    var deletedSubjectsList=[];    

    vm.schoolId = authentication.schoolId();
    
    handbookData.getSubjects(vm.schoolId.schoolId)
    .success(function(data){
      if(data){
        vm.subjects=data; 
      }
    });

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.subjects,function(subject){
        subject.selected=vm.selectedAll;
      })

    }
    vm.addSubject=function(){
      vm.subjects.push({
         Subject:"",
         SubjectCode:"",
         SchoolId: vm.schoolId.schoolId
      });
    }

    vm.updateSubject=function(){
      
      handbookData.updateSubjectList(vm.subjects)
            .success(function(result){
              alert("Subjects updated successfully");  
              $location.path("/home");
            })
            .error(function(e){
               console.log(e);
               alert("Failed to update record. Please try again");

          });
    }
    
    vm.deleteSubject=function(){
      var newList=[];
      var deleteList=[];
      vm.selectedAll=false;
      angular.forEach(vm.subjects,function(subject){
        if(!subject.selected){
           newList.push(subject); 
        }
        else{
          deleteList.push(subject);
        }
      });
      vm.subjects=newList;
    }
    vm.selectedAll=false;

    vm.pageHeader = {
      title: 'School Subjects'
    };
    
  }

})();