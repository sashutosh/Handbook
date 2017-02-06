angular
.module('handbook')
.controller('homeCtrl', homeCtrl);

function homeCtrl ($scope) {
    $scope.pageHeader = {
        title: 'SchoolLink',
        strapline: 'Reduce the gap betwen parents and school'
    };
    $scope.sidebar = {
        content: "Looking for solution to communicate effectively."
    };
}