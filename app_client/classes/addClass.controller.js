(function () {
angular
    .module('handbook')
    .controller('addClassModalCtrl', addClassModalCtrl);
    
    addClassModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
    
    function addClassModalCtrl ($modalInstance,handbookData,authentication) {
    var vm = this;
    //vm.schoolData = $modalInstance.schoolData;
        
    vm.onSubmit = function () {
    
        vm.modal.close(vm.currentEvent);
    };
    

    
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