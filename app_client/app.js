(function () {

  angular.module('handbook', ['ngRoute','ngSanitize','ui.bootstrap','angularUtils.directives.dirPagination']);

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
      .when('/teachers/edit', {
        templateUrl: '/teachers/editTeacher.view.html',
        controller: 'editTeacherCtrl',
        controllerAs: 'vm'
      })
      .when('/students', {
        templateUrl: '/students/students.view.html',
        controller: 'studentCtrl',
        controllerAs: 'vm'
      })
      .when('/students/edit', {
        templateUrl: '/students/editStudent.view.html',
        controller: 'editStudentCtrl',
        controllerAs: 'vm'
      })
      .when('/classes', {
        templateUrl: '/classes/classes.view.html',
        controller: 'classCtrl',
        controllerAs: 'vm'
      })
      .when('/subjects', {
        templateUrl: '/subjects/subjects.view.html',
        controller: 'subjectCtrl',
        controllerAs: 'vm'
      })
      .when('/schedule', {
        templateUrl: '/schedule/schedule.view.html',
        controller: 'scheduleCtrl',
        controllerAs: 'vm'
      })
      .when('/schedule/classSchedule', {
        templateUrl: '/schedule/classSchedule.view.html',
        controller: 'classScheduleCtrl',
        controllerAs: 'vm'
      })
      .when('/messages', {
        templateUrl: '/messages/messages.view.html',
        controller: 'messageCtrl',
        controllerAs: 'vm'
      })
      .when('/inbox', {
        templateUrl: '/messages/inbox.view.html',
        controller: 'inboxCtrl',
        controllerAs: 'vm'
      })
      .when('/outbox', {
        templateUrl: '/messages/outbox.view.html',
        controller: 'outboxCtrl',
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