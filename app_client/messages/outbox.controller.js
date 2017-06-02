(function () {

  angular
    .module('handbook')
    .controller('outboxCtrl', outboxCtrl);

  outboxCtrl.$inject= ['$location','handbookData','messaging','authentication'];  
  
  function outboxCtrl($location,handbookData,messaging,authentication) {
    var vm = this;
    vm.userId=authentication.userId().userId; 
    vm.schoolId=authentication.schoolId().schoolId;  
    //vm.selectedIds = {"002": true,"003":false};
    vm.selectedMessage =[];
    
    vm.pageHeader = {
      title: 'Outbox'
    };

    vm.compose=function(){
      $location.path("/messages");
    }

    vm.sortDate=function(message){
      var date = new Date( message.date.replace( /(\d{2})\/(\d{2})\/(\d{4})/, "$2/$1/$3") );;
      return date;
    }

    messaging.getSentMessages(vm.schoolId, vm.userId)
    .success(function(data){
        vm.messages=data;
        formatSentMessages(vm.messages);
    });

  }
  var formatSentMessages=function(messages){
    for(var i=0;i<messages.length;i++){
      if(messages[i].ToNames.length > 1)
      {
        messages[i].SentToText = messages[i].ToNames[0]+" +" +messages[i].ToNames.length +" Others"
      }
    }
  }
})();
