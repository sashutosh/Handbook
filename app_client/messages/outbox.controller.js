(function () {

  angular
    .module('handbook')
    .controller('outboxCtrl', outboxCtrl);

  outboxCtrl.$inject= ['$location','handbookData','messaging'];  
  
  function outboxCtrl($location,handbookData,messaging) {
    var vm = this;
    vm.userId='007'; 
    vm.schoolId=100;  
    //vm.selectedIds = {"002": true,"003":false};
    vm.selectedMessage =[];
    
    vm.pageHeader = {
      title: 'Outbox'
    };

    messaging.getSentMessages(vm.schoolId, vm.userId)
    .success(function(data){
        vm.messages=data;
    });

  }
})();
