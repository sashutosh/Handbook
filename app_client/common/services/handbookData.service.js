(function() {

  angular
    .module('handbook')
    .service('handbookData', handbookData);

  handbookData.$inject = ['$http'];
  function handbookData ($http) {
    var schoolDetailsById = function (schoolId) {
      return $http.get('/school/' + schoolId);
    };
    return {
      schoolDetailsById : schoolDetailsById
    };
  }

})();