(function () {

  angular
    .module('handbook')
    .controller('classScheduleCtrl', classScheduleCtrl);

  classScheduleCtrl.$inject= ['handbookData','$modal'];    
  function classScheduleCtrl(handbookData,$modal) {
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
    
    // vm.popupAddStudentBulkForm=function(){
    //     //alert("School details not added");
        
    //     var modalInstance=$modal.open({
    //         templateUrl:'/addStudentBulkModal/addStudentBulkModal.view.html',
    //         controller: 'addStudentBulkModalCtrl as vm',
    //         // resolve : {
    //         //     schoolData = function() {return vm.school;} 
    //         // }
    //     });
    //     //modalInstance.schoolData =vm.school;
    //     // modalInstance.result.then(function (data) {
    //     //     vm.pageHeader.strapline="Added school" + data;
    //     //     vm.popupAddStudentBulkForm();
    //     // });

    // };
    vm.addSubOne=function(key){

        var modalInstance=$modal.open({
            templateUrl:'/schedule/addScheduleModal.view.html',
            controller: 'addScheduleModalCtrl as vm',
            // resolve : {
            //     schoolData = function() {return vm.school;} 
            // }
        });

    }
  }

})();