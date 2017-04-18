(function () {
    angular
.module('handbook')
.controller('siteHomeCtrl', siteHomeCtrl);

siteHomeCtrl.$inject = ['$scope','handbookData','authentication','$modal','$location'];
function siteHomeCtrl ($scope,handbookData,authentication,$modal,$location) {
    var vm=this;

    if(authentication.isLoggedIn()){
        //Not logged in user redirect to the home page
         $location.path("/home");
    }
   
    vm.pageHeader = {
        title: 'SchoolLink',
        strapline: 'Reduce the gap betwen parents and school'
    };
    vm.sidebar = {
        content: "Looking for solution to communicate effectively."
    };
   
}
})();