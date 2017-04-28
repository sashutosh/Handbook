(function () {

  angular
    .module('handbook')
    .controller('selectRecipientsModalCtrl', selectRecipientsModalCtrl);
  
  selectRecipientsModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];  
  
  function selectRecipientsModalCtrl($modalInstance,handbookData,authentication) {
    var vm = this;
    var selectedStudentsList =[];
    handbookData.getStudents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.students=data;
      }
    })
    .error(function(e){
        console.log(e);
       // vm.popupAddSchoolForm();
       //alert("School data not found");
    });

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