(function () {
angular
    .module('handbook')
    .controller('addClassModalCtrl', addClassModalCtrl);
    
    addClassModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
    
    function addClassModalCtrl ($modalInstance,handbookData,authentication) {
    var vm = this;
    vm.Class ={};
    vm.classSection ="";
    vm.className="";
    //vm.schoolData = $modalInstance.schoolData;
        
    vm.onSubmit = function () {
    
        vm.Class.Class=vm.className;
        vm.Class.Section =vm.classSection;  
        vm.modal.close(vm.Class);
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