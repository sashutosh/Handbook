(function() {

  angular
    .module('handbook')
    .service('handbookData', handbookData);

  handbookData.$inject = ['$http'];
  function handbookData ($http) {
    
    var selectedTeacher={};
    var selectedStudent={};

    var setSelectedTeacher=function(teacher){
      selectedTeacher=teacher;
    }

    var getSelectedTeacher=function(){
      return selectedTeacher;
    }

    var setSelectedStudent=function(student){
      selectedStudent=student;
    }

    var getSelectedStudent=function(){
      return selectedStudent;
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

    var uploadFile = function(fileToUpload,uploadUrl){
        var fd = new FormData();
        fd.append('picture', fileToUpload);
        $http.post(uploadUrl,fd,{
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}}).success(function(data){
          console.log("Uploaded Image successfully"+data);
          console.log("ImageUrl"+data.ImageUrl);
        })
        .error(function(data){
          console.log("Failed to upload image:"+ data);
       });
    
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
      setSelectedTeacher:setSelectedTeacher,
      getSelectedStudent:getSelectedStudent,
      setSelectedStudent:setSelectedStudent,
      uploadFile:uploadFile
    };
  }

})();