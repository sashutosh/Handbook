(function () {

  angular
    .module('handbook')
    .controller('messageCtrl', messageCtrl);
  messageCtrl.$inject= ['$location','messaging','$modal'];     
  function messageCtrl($location,messaging,$modal) {
    
    var vm = this;
    vm.messageSubject="";
    vm.messageText="";
    vm.selectedRecipients= messaging.getSelectedRecipientsList();  
    vm.selectedRecipientsPhoneNumbers=messaging.getSelectedRecipientsPhone();

    vm.pageHeader = {
      title: 'Messages'
    };

    vm.send=function(){
      console.log("Sending message");
      var msgJsonObject = vm.prepareMessage();
      messaging.sendMessage(msgJsonObject);
    };

    vm.selectRecipients=function(){

      var modalInstance=$modal.open({
            templateUrl:'/messages/selectRecipientsModal.view.html',
            controller: 'selectRecipientsModalCtrl as vm',
            });

    }
    
    vm.prepareMessage=function(){

        var msgObject={};
        msgObject.MessageBody= vm.messageSubject;
        msgObject.MessageTitle= vm.messageSubject;
        msgObject.type="DIARY_NOTE";
        msgObject.FromType="Admin";
        msgObject.FromId="007";
        msgObject.MobileNumbers=messaging.getSelectedRecipientsPhone();
        msgObject.ToIds=messaging.getSelectedRecipientsId();
        return msgObject;  
    };
  }

})();