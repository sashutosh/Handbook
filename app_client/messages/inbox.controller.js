(function () {

  angular
    .module('handbook')
    .controller('inboxCtrl', inboxCtrl);

  inboxCtrl.$inject= ['$location','handbookData','messaging','authentication'];  
  
  function inboxCtrl($location,handbookData,messaging,authentication) {
    var vm = this;
    vm.userId=authentication.userId().userId; 
    vm.schoolId=authentication.schoolId().schoolId;  
    //vm.selectedIds = {"002": true,"003":false};
    vm.selectedMessage =[];

    vm.compose=function(){
      $location.path("/messages");
    }
    
    vm.pageHeader = {
      title: 'Inbox'
    };

    messaging.getMessages(vm.schoolId,'003')
    .success(function(data){
        vm.messages=data;
    });

  }
})();
