(function() {

  angular
    .module('handbook')
    .service('messaging',messaging);

  messaging.$inject = ['$http'];
  function messaging ($http) {
    var studentList=[];
    var teacherList=[];

   var getSelectedRecipientsList=function(){
     var selecetedObjList ="";
     for(var i=0; i<teacherList.length; i++){
        if(selecetedObjList==="")
          selecetedObjList= getTeacherName(teacherList[i]); 
        else  
          selecetedObjList= selecetedObjList + "," + getTeacherName(teacherList[i]);;
      }
      return selecetedObjList;
   }

   var getSelectedRecipientsPhone=function(){
     var selecetedPhoneList =[];
     for(var i=0; i<teacherList.length; i++){
        selecetedPhoneList.push(teacherList[i].MobileNumber)
      }
      return selecetedPhoneList;
   }

   var getSelectedRecipientsId=function(){
     var selecetedIdList =[];
     for(var i=0; i<teacherList.length; i++){
        selecetedIdList.push(teacherList[i].TeacherId)
      }
      return selecetedIdList;
   }

   var sendMessage=function(messageJsonObject){
      $http.put('/SendMessageToMultipleUser',messageJsonObject).success(function(data){
        console.log("Sent message successfully"+data);
    })
    .error(function(data){
      console.log("Failed to send message error:"+data);
    });
   }

    var getTeacherName=function(teacher){
        return teacher.TeacherFirstName + " " +teacher.TeacherLastName;
    }
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
        clearTeacherList:clearTeacherList,
        getSelectedRecipientsList:getSelectedRecipientsList,
        getSelectedRecipientsPhone:getSelectedRecipientsPhone,
        getSelectedRecipientsId:getSelectedRecipientsId,
        sendMessage:sendMessage
    };
  }
})();