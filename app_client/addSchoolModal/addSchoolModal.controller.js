(function () {
angular
    .module('handbook')
    .controller('addSchoolModalCtrl', addSchoolModalCtrl);
    
    addSchoolModalCtrl.$inject = ['$modalInstance'];
    function addSchoolModalCtrl ($modalInstance) {
        var vm = this;

        vm.onSubmit = function () {
            vm.formError = "";
            if(!vm.formData.name || !vm.formData.address) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                console.log(vm.formData);
                return false;
            }
        };
        //vm.schoolData = schoolData;
        vm.modal = {
            cancel : function () {
                $modalInstance.dismiss('cancel');
            }
        };
    }
    
})();