(function () {
angular
    .module('handbook')
    .controller('addSchoolModalCtrl', addSchoolModalCtrl);
    
    addSchoolModalCtrl.$inject = ['$modalInstance'];
    function addSchoolModalCtrl ($modalInstance) {
        var vm = this;
        //vm.schoolData = schoolData;
        vm.modal = {
            cancel : function () {
                $modalInstance.dismiss('cancel');
            }
        };
    }
})();