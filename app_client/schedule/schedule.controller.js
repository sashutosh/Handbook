(function () {

  angular
    .module('handbook')
    .controller('scheduleCtrl', scheduleCtrl);

  scheduleCtrl.$inject= ['$location','handbookData','authentication'];  
  
  function scheduleCtrl($location,handbookData,authentication) {
    var vm = this;

    vm.schoolId = authentication.schoolId();

    vm.pageHeader = {
      title: 'Class Timetable'
    };
    
    handbookData.getClasses(vm.schoolId.schoolId)
    .success(function(data){
      if(data){
        vm.classes=data; 
      }
    });

    vm.editSchedule=function(selectedClass){
        handbookData.setSelectedClass(selectedClass);    
        $location.path("/schedule/classSchedule")
    }
  }

})();