(function () {

  angular
    .module('handbook')
    .controller('editStudentCtrl', editStudentCtrl);

    editStudentCtrl.$inject= ['$location','handbookData','messaging'];  
    function editStudentCtrl($location,handbookData,messaging) {
  
      
        var vm = this;
        vm.student = handbookData.getSelectedStudent();
        
        vm.pageHeader = {
          title: 'Edit Student'
        };

    }
})();
  
