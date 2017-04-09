(function () {

  angular
    .module('handbook')
    .controller('classScheduleCtrl', classScheduleCtrl);

  classScheduleCtrl.$inject= ['handbookData'];    
  function classScheduleCtrl(handbookData) {
    var vm = this;
    vm.classSchedule={};
    vm.pageHeader = {
      title: 'Class Schedule'
    };

    vm.selectedClass = handbookData.getSelectedClass();

    handbookData.getClassTimetable(vm.selectedClass.ClassSection)
    .success(function(data){
       vm.classSchedule=data;     
    });
    
  }

})();