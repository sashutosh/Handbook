(function () {

  angular
    .module('handbook')
    .controller('messageCtrl', messageCtrl);
  messageCtrl.$inject= ['$location','messaging','$modal'];     
  function messageCtrl($location,messaging,$modal) {
    
    var vm = this;
    vm.messageSubject="";
    vm.messageText="";
    vm.selectedRecipientsObjectList=[];
    vm.selectedRecipients=[];
    vm.selectedRecipientsId=[];
    vm.selectedRecipientsPhoneNumbers=[];

    vm.selectedRecipients= messaging.getSelectedRecipientsList();  
    vm.selectedRecipientsPhoneNumbers=messaging.getSelectedRecipientsPhone();
    vm.selectedRecipientsId= messaging.getSelectedRecipientsId();
    vm.pageHeader = {
      title: 'Messages'
    };

    vm.send=function(){
      console.log("Sending message");
      var msgJsonObject = vm.prepareMessage();
      messaging.sendMessage(msgJsonObject);
    };

    var setPhoneNumbersAndIds=function(selectRecipients){
      //Clear the previous data if any
      vm.selectedRecipientsPhoneNumbers.length=0;
      vm.selectedRecipientsId.length=0;
      vm.selectedRecipients.length=0;

      angular.forEach(selectRecipients,function(selectedObject){
        angular.forEach(selectedObject.StudentParentMobiles,function(mobileNumber){
            vm.selectedRecipientsPhoneNumbers.push(mobileNumber)
        })
        vm.selectedRecipientsId.push(selectedObject.StudentId);
        vm.selectedRecipients.push(selectedObject.StudentFirstName);  
      });
    }
    vm.selectRecipients=function(){

      var modalInstance=$modal.open({
            templateUrl:'/messages/selectRecipientsModal.view.html',
            controller: 'selectRecipientsModalCtrl as vm',
          });
          
      modalInstance.result.then(function (selectedStudentsList) {
            
            vm.selectedRecipientsObjectList=selectedStudentsList;
            if(vm.selectedRecipientsObjectList.length>0){
              setPhoneNumbersAndIds(vm.selectedRecipientsObjectList);
            }      
            console.log("Edited a new timeslot");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }
    
    vm.prepareMessage=function(){

        var msgObject={};
        
        msgObject.MessageBody= vm.messageSubject;
        msgObject.MessageTitle= vm.messageSubject;
        msgObject.type="DIARY_NOTE";
        msgObject.FromType="Admin";
        msgObject.FromId="007";
        msgObject.MobileNumbers=vm.selectedRecipientsPhoneNumbers;
        msgObject.ToIds=vm.selectedRecipientsId;
        return msgObject;  
    };
  }

})();