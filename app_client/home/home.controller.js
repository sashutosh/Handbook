(function () {
    angular
.module('handbook')
.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope','handbookData','$modal'];
function homeCtrl ($scope,handbookData,$modal) {
    var vm=this;

    vm.school = {
        schoolId : 116,
        schoolName : "DPS East"    
    };
    handbookData.schoolDetailsById(vm.school.schoolId)
    .success(function(data){
        if(data){
            vm.data = {school : data};
            vm.pageHeader ={title : data.SchoolFullName};
        }
        else
        {
        }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });
    
    vm.pageHeader = {
        title: 'SchoolLink',
        strapline: 'Reduce the gap betwen parents and school'
    };
    vm.sidebar = {
        content: "Looking for solution to communicate effectively."
    };
    vm.popupAddSchoolForm=function(){
        //alert("School details not added");
        
        var modalInstance=$modal.open({
            templateUrl:'/addSchoolModal/addSchoolModal.view.html',
            controller: 'addSchoolModalCtrl as vm',
            // resolve : {
            //     schoolData = function() {return vm.school;} 
            // }
        });
        modalInstance.schoolData =vm.school;
        modalInstance.result.then(function (data) {
            vm.pageHeader.strapline="Added school" + data;
            vm.popupAddStudentBulkForm();
        });

    };

    vm.popupAddStudentBulkForm=function(){
        //alert("School details not added");
        
        var modalInstance=$modal.open({
            templateUrl:'/addStudentBulkModal/addStudentBulkModal.view.html',
            controller: 'addStudentBulkModalCtrl as vm',
            // resolve : {
            //     schoolData = function() {return vm.school;} 
            // }
        });
        //modalInstance.schoolData =vm.school;
        // modalInstance.result.then(function (data) {
        //     vm.pageHeader.strapline="Added school" + data;
        //     vm.popupAddStudentBulkForm();
        // });

    };
}
})();