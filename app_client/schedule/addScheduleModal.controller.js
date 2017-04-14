(function () {
angular
    .module('handbook')
    .controller('addScheduleModalCtrl', addScheduleModalCtrl);
    
    addScheduleModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
    function addScheduleModalCtrl ($modalInstance,handbookData,authentication) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        
        vm.schoolId = authentication.schoolId();

        handbookData.getSubjects(vm.schoolId.schoolId)
            .success(function(data){
                if(data){
                    vm.subjects=data; 
                }
        });
        
        vm.days =['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        
        vm.onSubmit = function () {
            vm.formError = "";
            // if(!vm.formData.picture) {
            //     vm.formError = "All fields required, please try again";
            //     return false;
            // } else 
            {
                // vm.formData.picture ="E:\\Handbook\\StudentRecord\\StudentTemp.xlsx"
                
                // console.log(vm.formData);
                // vm.addStudentBulk(vm.formData);
                return false;
            }
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