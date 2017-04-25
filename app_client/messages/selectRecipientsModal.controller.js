(function () {

  angular
    .module('handbook')
    .controller('selectRecipientsModalCtrl', selectRecipientsModalCtrl);
  
  selectRecipientsModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];  
  
  function selectRecipientsModalCtrl($modalInstance,handbookData,authentication) {
    var vm = this;

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

    vm.modal = {
        close : function (result) {
            $modalInstance.close(result);
        },
        cancel : function () {
            $modalInstance.dismiss('cancel');
        }
    };
  }

})();