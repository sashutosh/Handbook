(function () {

  angular.module('handbook', ['ngRoute']);

  function config ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl'
      })
      .otherwise({redirectTo: '/'});
  }

  angular
    .module('handbook')
    .config(['$routeProvider', config]);

})();