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
    vm.selectedDay =0;
    handbookData.getClassTimetable(vm.selectedClass.ClassSection)
    .success(function(data){
       vm.classSchedule=data;     
    });
    
    vm.getSelectedDayId =function(day){
      if(day==="Monday"){
        return 0;
      }
      else if(day==="Tuesday"){
        return 1;
      }
      else if(day==="Wednesday"){
        return 2;
      }
      else if(day==="Thursday"){
        return 3;
      }
      else if(day==="Friday"){
        return 4;
      }
      else if(day==="Saturday"){
        return 5;
      }
      else if(day==="Sunday"){
        return 6;
      }
      else{
        return 0;
      }
    }


    vm.editSubOne=function(subSchedule){

    }
    
    vm.addSubOne=function(daySchedule){
        vm.selectedDay= vm.getSelectedDayId(daySchedule.Day);
        var modalInstance=$modal.open({
            templateUrl:'/schedule/addScheduleModal.view.html',
            controller: 'addScheduleModalCtrl as vm',
            resolve : {
                currentDaySchedule : function() {
                  return {
                    
                    schedule : daySchedule
                };
              } 
            }
        });

        modalInstance.result.then(function (timeSlot) {
            
            vm.classSchedule.Days[vm.selectedDay].TimeSlots.push(timeSlot);
            console.log("Added a new timeslot");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }
    
    vm.editSubOne=function(subSched){
      
        var modalInstance=$modal.open({
            templateUrl:'/schedule/editScheduleModal.view.html',
            controller: 'editScheduleModalCtrl as vm',
            resolve : {
                subSchedule : function() {
                  return {
                    
                    slot : subSched
                };
              } 
            }
        });

        modalInstance.result.then(function (timeSlot) {
            
            subSched=timeSlot;
            console.log("Edited a new timeslot");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }


  }

})();