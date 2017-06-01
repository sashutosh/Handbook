(function() {

  angular
    .module('handbook')
    .service('handbookData', handbookData);

  handbookData.$inject = ['$http'];
  function handbookData ($http) {
    
    var selectedTeacher={};
    var selectedStudent={};
    var selectedClass ={};
    
    var setSelectedTeacher=function(teacher){
      selectedTeacher=teacher;
    }

    var getSelectedTeacher=function(){
      return selectedTeacher;
    }

    var setSelectedClass=function(selClass){
      selectedClass=selClass;
    }

    var getSelectedClass=function(){
      return selectedClass;
    }

    var setSelectedStudent=function(student){
      selectedStudent=student;
    }

    var getSelectedStudent=function(){
      return selectedStudent;
    }

    var getClassTimetable=function(classSection){
      return $http.get('/StudentTimeTableForClassStandard/' + classSection);
    }

    var updateTimeTable=function(classStd,classSchedule){
      return $http.post('/StudentTimeTableForClassStandard/',classSchedule);
    }

    var schoolDetailsById = function (schoolId) {
      return $http.get('/school/' + schoolId);
    };

    var addSchool = function(schoolData){
      return $http.put('/school/',schoolData);
    };

    var getTeachers= function (schoolId){
      return $http.get('/AllTeachers/' + schoolId);
    }

    var getSubjects= function (schoolId){
      var url = "/subject/" + schoolId;
      return $http.get(url);
    }

    var updateSubjectList=function(subjects){
      var url ="/uploadMultipleSubjectData"
      return $http.post(url,subjects);
    }

    var updateClassesList=function(teachers){
      var url ="/uploadMultipleClassData"
      return $http.post(url,teachers);
    }

    var getClasses= function (schoolId){
      return $http.get('/class/'+schoolId);
    }
    var getStudents= function (schoolId){
      return $http.get('/AllStudents/' + schoolId, { cache: true});
    }

    var deleteTeacher= function(teacherId){
      return $http.delete('/teachers/'+ teacherId);
    }

    var updateTeacher =function(teacher){
      return $http.post('/teachers',teacher);
    }

    var deleteStudent= function(studentId){
      return $http.delete('/students'+ studentId);
    } 

    var updateStudent =function(student){
      return $http.post('/students',student);
    }

    var getSchoolEvents= function (schoolId){
      return $http.get('/EventsForSchool/' + schoolId);
    }

    var getModelCounts =function(schoolId){
      return $http.get('/ModelCount/' + schoolId);
    }

    var uploadFile = function(fileToUpload,uploadUrl){
        var fd = new FormData();
        fd.append('picture', fileToUpload);
        return $http.post(uploadUrl,fd,{
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}})
        .then(function(result){
          return result.data;
        });
      //   .success(function(data){
      //     console.log("Uploaded Image successfully"+data);
      //     console.log("ImageUrl"+data.ImageUrl);
      //   })
      //   .error(function(data){
      //     console.log("Failed to upload image:"+ data);
      //  });
    
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
      updateTeacher:updateTeacher,
      getStudents:getStudents,
      getSubjects,getSubjects,
      updateClassesList,updateClassesList,
      updateSubjectList,updateSubjectList,
      getClasses,getClasses,
      deleteTeacher:deleteTeacher,
      deleteStudent:deleteStudent,
      updateStudent:updateStudent,
      getSelectedTeacher:getSelectedTeacher,
      setSelectedTeacher:setSelectedTeacher,
      getSelectedStudent:getSelectedStudent,
      setSelectedStudent:setSelectedStudent,
      getSelectedClass:getSelectedClass,
      setSelectedClass:setSelectedClass,
      getClassTimetable:getClassTimetable,
      updateTimeTable:updateTimeTable,
      getSchoolEvents:getSchoolEvents,
      getModelCounts:getModelCounts,
      uploadFile:uploadFile
    };
  }

})();