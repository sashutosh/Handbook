(function () {
angular
    .module('handbook')
    .directive('sideNavigation', sideNavigation);
    function sideNavigation () {
        return {
            restrict: 'EA',
            templateUrl: '/common/directives/sideNavigation/sideNavigation.template.html'
        };
    }
})();