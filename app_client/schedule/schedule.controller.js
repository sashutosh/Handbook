(function () {

  angular
    .module('handbook')
    .controller('scheduleCtrl', scheduleCtrl);

  scheduleCtrl.$inject= ['$location','handbookData'];  
  
  function scheduleCtrl($location,handbookData) {
    var vm = this;

    
    vm.pageHeader = {
      title: 'Class Timetable'
    };
    
    handbookData.getClasses(vm.schoolId)
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