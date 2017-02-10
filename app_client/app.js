(function () {

  angular.module('handbook', ['ngRoute','ngSanitize']);

  function config ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: '/common/views/genericText.view.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }

  angular
    .module('handbook')
    .config(['$routeProvider', '$locationProvider',config]);

})();