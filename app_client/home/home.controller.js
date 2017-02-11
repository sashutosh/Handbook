(function () {
    angular
.module('handbook')
.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope','handbookData','$modal'];
function homeCtrl ($scope,handbookData,$modal) {
    var vm=this;

    handbookData.schoolDetailsById(100)
    .success(function(data){
        if(data){
            vm.data = {school : data};
            vm.pageHeader ={title : data.school.SchoolFullName};
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
            //     schoolData = function () {
            //         return {
            //             schoolName : 'DPS' ,
            //         };
            //     }
            // }
        });
        modalInstance.result.then(function (data) {
            vm.pageHeader.strapline="Added school" + data;
        });

    };
}
})();