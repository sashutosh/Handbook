(function () {

  angular
    .module('handbook')
    .controller('editTeacherCtrl', editTeacherCtrl);

    editTeacherCtrl.$inject= ['$location','handbookData','messaging'];  
    function editTeacherCtrl($location,handbookData,messaging) {
  
      
        var vm = this;
        vm.teacher = handbookData.getSelectedTeacher();
        
        vm.pageHeader = {
          title: 'Edit Teacher'
        };

    }
})();
  
