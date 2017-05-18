(function() {

  angular
    .module('handbook')
    .service('messaging',messaging);

  messaging.$inject = ['$http'];
  function messaging ($http) {
    var messageList=[];
    var teacherList=[];
    var selecetedObjList =[];
    var selecetedPhoneList =[];
    var selecetedIdList =[];

   var getSelectedRecipientsList=function(){
     
     for(var i=0; i<messageList.length; i++){
        selecetedObjList.push(messageList[i].Name);
        selecetedPhoneList.push(messageList[i].MobileNumber)
        selecetedIdList.push(messageList[i].TeacherId)
      }
      return selecetedObjList;
   }

   var getSelectedRecipientsPhone=function(){
      return selecetedPhoneList;
   }

   var getSelectedRecipientsId=function(){
     
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

   var getMessages=function(schoolId, userId){
     return $http.get('/Messages/'+userId);
     
   }

   var getAllMessages=function(schoolId){
     return $http.get('/Messages');
     
   }

   var getSentMessages=function(schoolId, userId){
     return $http.get('/Messages/from/'+userId);
     
   }
   
   var getTeacherName=function(teacher){
        return teacher.TeacherFirstName + " " +teacher.TeacherLastName;
    }
    var addtoMessageList=function(studentObj){
       messageList.push(studentObj);     
    };

    var getMessageList=function(){
       return messageList;     
    };

    var clearMessageList=function(){
        messageList=[];    
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
        addtoMessageList:addtoMessageList,
        getMessageList:getMessageList,
        clearMessageList:clearMessageList,
        addtoTeacherList:addtoTeacherList,
        getTeacherList:getTeacherList,
        clearTeacherList:clearTeacherList,
        getSelectedRecipientsList:getSelectedRecipientsList,
        getSelectedRecipientsPhone:getSelectedRecipientsPhone,
        getSelectedRecipientsId:getSelectedRecipientsId,
        sendMessage:sendMessage,
        getMessages:getMessages,
        getSentMessages:getSentMessages,
        getAllMessages:getAllMessages
    };
  }
})();