(function () {

  angular
    .module('handbook')
    .controller('selectRecipientsModalCtrl', selectRecipientsModalCtrl);
  
  selectRecipientsModalCtrl.$inject = ['$modalInstance','handbookData','authentication','currentSelectedStudents'];  
  
  function selectRecipientsModalCtrl($modalInstance,handbookData,authentication,currentSelectedStudents) {
    var vm = this;
    vm.students=currentSelectedStudents.students;
    
    //Mark all students as selected by default
    
    
    var selectedStudentsList =[];
   
    
    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.students,function(student){
        student.selected=vm.selectedAll;
      })

    }
    vm.checkAll();
    vm.modal = {
        close : function (result) {
            $modalInstance.close(result);
        },
        cancel : function () {
            $modalInstance.dismiss('cancel');
        }
    };
    vm.addSelectedStudent=function(){

        angular.forEach(vm.students,function(student){
        if(student.selected){
            selectedStudentsList.push(student);
        }
      });
      vm.modal.close(selectedStudentsList);
    }
  }

})();