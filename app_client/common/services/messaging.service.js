(function() {

  angular
    .module('handbook')
    .service('messaging',messaging);

  messaging.$inject = ['$http'];
  function messaging ($http) {
    var studentList=[];
    var teacherList=[];

    var addtoStudentList=function(studentObj){
       studentList.push(studentObj);     
    };

    var getStudentList=function(){
       return studentList;     
    };

    var clearStudentList=function(){
        studentList=[];    
    };

    var addtoTeacherList=function(teacherObj){
       teacherList.push(teacherObj);     
    };

    var getTeacherList=function(){
       return teacherList;     
    };

    var clearTeacherList=function(){
        teacherList=[];    
    };
    
    var schoolDetailsById = function (schoolId) {
      return $http.get('/school/' + schoolId);
    };

    return{
        addtoStudentList:addtoStudentList,
        getStudentList:getStudentList,
        clearStudentList:clearStudentList,
        addtoTeacherList:addtoTeacherList,
        getTeacherList:getTeacherList,
        clearTeacherList:clearTeacherList

    };
  }
})();