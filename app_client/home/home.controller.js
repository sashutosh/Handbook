(function () {
    angular
.module('handbook')
.controller('homeCtrl', homeCtrl);

homeCtrl.$inject = ['$scope','handbookData'];
function homeCtrl ($scope,handbookData) {
    var vm=this;

    handbookData.schoolDetailsById(100)
    .success(function(data){
        vm.data = {school : data};
        vm.pageHeader ={title : data.school.SchoolFullName};
    })
    .error(function(e){
        console.log(e);
    });
    vm.pageHeader = {
        title: 'SchoolLink',
        strapline: 'Reduce the gap betwen parents and school'
    };
    vm.sidebar = {
        content: "Looking for solution to communicate effectively."
    };
}
})();