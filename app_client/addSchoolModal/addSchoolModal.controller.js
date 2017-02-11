(function () {
angular
    .module('handbook')
    .controller('addSchoolModalCtrl', addSchoolModalCtrl);
    
    addSchoolModalCtrl.$inject = ['$modalInstance','handbookData'];
    function addSchoolModalCtrl ($modalInstance,handbookData) {
        var vm = this;

        vm.onSubmit = function () {
            vm.formError = "";
            if(!vm.formData.name || !vm.formData.address) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                console.log(vm.formData);
                vm.addSchool(vm.formData);
                return false;
            }
        };
        //vm.schoolData = schoolData;

        vm.addSchool = function(formData){
            handbookData.addSchool({
                "SchoolId":100,
                "SchoolFullName": formData.name,
                "SchoolFullAddress": formData.address,
                "SchoolMainTelephoneNumber": 9343603060,
                "SchoolWebSite": "http://www.greenwoodhigh.edu.in/",
                "SchoolCity": "Bangalore",
                "SchoolState": "Karnataka",
                "SchoolAddressPOBox": 560083,
                "SchoolDistrict": "Bangalore",
                "SchoolType": "Private",
                "ImageUrl": " ",
                "ImageUrlLogo": " ",
                "AdditionalContactNumbers": [
                    98567899088,
                    76543567890
                ]
            })
            .success(function(data){
                console.log("Successfully added school"+data);
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