(function() {

  angular
    .module('handbook')
    .service('handbookData', handbookData);

  handbookData.$inject = ['$http'];
  function handbookData ($http) {
    
    var selectedTeacher={};
    
    var setSelectedTeacher=function(teacher){
      selectedTeacher=teacher;
    }

    var getSelectedTeacher=function(){
      return selectedTeacher;
    }


    var schoolDetailsById = function (schoolId) {
      return $http.get('/school/' + schoolId);
    };

    var addSchool = function(schoolData){
      return $http.put('/school/',schoolData);
    };

    var getTeachers= function (schoolId){
      return $http.get('/teachers/');
    }

    var getStudents= function (schoolId){
      return $http.get('/students/');
    }

    var deleteTeacher= function(teacherId){
      return $http.delete('/teachers/'+ teacherId);
    }

    var deleteStudent= function(studentId){
      return $http.delete('/students/'+ studentId);
    } 

    var addStudentBulk = function(studentRecordfile){
        var fd = new FormData();
        fd.append('picture', studentRecordfile);
        fd.append('schoolId','115');
        return $http.post('/uploadStudentData',fd,{
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}})
    };
    return {
      schoolDetailsById : schoolDetailsById,
      addSchool: addSchool,
      addStudentBulk: addStudentBulk,
      getTeachers:getTeachers,
      getStudents:getStudents,
      deleteTeacher:deleteTeacher,
      deleteStudent:deleteStudent,
      getSelectedTeacher:getSelectedTeacher,
      setSelectedTeacher:setSelectedTeacher
    };
  }

})();