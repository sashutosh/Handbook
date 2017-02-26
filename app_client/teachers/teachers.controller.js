(function () {

  angular
    .module('handbook')
    .controller('teacherCtrl', teacherCtrl);

  teacherCtrl.$inject= ['handbookData'];  
  function teacherCtrl(handbookData) {
    var vm = this;
    vm.schoolId=100;  
    vm.pageHeader = {
      title: 'Teachers'
    };
    
    handbookData.getTeachers(vm.schoolId)
    .success(function(data){
      if(data){
        vm.teachers=data;
      }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });

  }

})();