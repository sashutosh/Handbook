(function () {

  angular.module('handbook', ['ngRoute','ngSanitize','ui.bootstrap']);

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
      .when('/teachers', {
        templateUrl: '/teachers/teachers.view.html',
        controller: 'teacherCtrl',
        controllerAs: 'vm'
      })
      .when('/classes', {
        templateUrl: '/classes/classes.view.html',
        controller: 'classCtrl',
        controllerAs: 'vm'
      })
      .when('/messages', {
        templateUrl: '/messages/messages.view.html',
        controller: 'messageCtrl',
        controllerAs: 'vm'
      })
      .when('/register', {
        templateUrl: '/auth/register/register.view.html',
        controller: 'registerCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: '/auth/login/login.view.html',
        controller: 'loginCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});
    $locationProvider.html5Mode(true);
  }

  angular
    .module('handbook')
    .config(['$routeProvider', '$locationProvider',config]);

})();