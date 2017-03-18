(function () {

  angular
    .module('handbook')
    .controller('inboxCtrl', inboxCtrl);

  inboxCtrl.$inject= ['$location','handbookData','messaging'];  
  
  function inboxCtrl($location,handbookData,messaging) {
    var vm = this;
    vm.userId='003'; 
    vm.schoolId=100;  
    //vm.selectedIds = {"002": true,"003":false};
    vm.selectedMessage =[];
    
    vm.pageHeader = {
      title: 'Inbox'
    };

    messaging.getMessages(vm.schoolId, vm.userId)
    .success(function(data){
        vm.messages=data;
    });

  }
})();
