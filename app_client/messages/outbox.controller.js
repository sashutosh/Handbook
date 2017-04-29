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

    messaging.getSentMessages(vm.schoolId, vm.userId)
    .success(function(data){
        vm.messages=data;
    });

  }
})();
