(function () {
angular
    .module('handbook')
    .controller('addStudentBulkModalCtrl', addStudentBulkModalCtrl);
    
    addStudentBulkModalCtrl.$inject = ['$modalInstance','handbookData'];
    function addStudentBulkModalCtrl ($modalInstance,handbookData) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        vm.onSubmit = function () {
            vm.formError = "";
            // if(!vm.formData.picture) {
            //     vm.formError = "All fields required, please try again";
            //     return false;
            // } else 
            {
                vm.formData.picture ="E:\\Handbook\\StudentRecord\\StudentTemp.xlsx"
                
                console.log(vm.formData);
                vm.addStudentBulk(vm.formData);
                return false;
            }
        };
        //vm.schoolData = schoolData;

        vm.addStudentBulk = function(formData){
            handbookData.addStudentBulk(formData.myFile)
            .success(function(data){
                console.log("Successfully added student records"+data);
                vm.modal.close(data);
            })
            .error(function (error){
                vm.formError="The school details could not be added due to error" + error;
            });
            return false;       
        }
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