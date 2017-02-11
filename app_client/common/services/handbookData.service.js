(function() {

  angular
    .module('handbook')
    .service('handbookData', handbookData);

  handbookData.$inject = ['$http'];
  function handbookData ($http) {
    
    var schoolDetailsById = function (schoolId) {
      return $http.get('/school/' + schoolId);
    };

    var addSchool = function(schoolData){
      return $http.put('/school/',schoolData);
    };



    return {
      schoolDetailsById : schoolDetailsById,
      addSchool, addSchool
    };
  }

})();