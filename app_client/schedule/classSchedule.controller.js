(function () {

  angular
    .module('handbook')
    .controller('classScheduleCtrl', classScheduleCtrl);

  classScheduleCtrl.$inject= ['handbookData','$modal','$location'];    
  function classScheduleCtrl(handbookData,$modal,$location) {
    var vm = this;
    vm.selectedCopyDay ={};
    vm.copiedTimeSlots={};
    vm.classSchedule={};
    vm.pageHeader = {
      title: 'Class Schedule'
    };

    vm.selectedClass = handbookData.getSelectedClass();
    vm.selectedDay =0;
    handbookData.getClassTimetable(vm.selectedClass.ClassSection)
    .success(function(data){
       vm.classSchedule=data;
       vm.classSchedule.ClassStandard = vm.selectedClass.ClassSection;     
       for(var i=0;i<vm.classSchedule.Days.length;i++){
         vm.classSchedule.Days[i].TimeSlots.sort(sortTimeSlots);
       }
    });


    sortTimeSlots=function(){
      return function(t1,t2){
        var splitTime = t1.StartTime.split(':');
        var t1Hour=splitTime[0];
        var t1Min=splitTime[1];
        splitTime = t2.StartTime.split(':');
        var t2Hour=splitTime[0];
        var t2Min=splitTime[1];
        if(parseInt(t1Hour)===parseInt(t2Hour)){
          return (parseInt(t1Min)-parseInt(t2Min));
        }
        else{
          return (parseInt(t1Hour)-parseInt(t2Hour))   
        }  
      }
    }

    vm.onReturnClick=function(){
      $location.path("/schedule");
    }
    
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

    vm.onSubmit=function(){
      
      handbookData.updateTimeTable(vm.classSchedule)
      .success(function(result){
              alert("Timetable updated successfully");  
              $location.path("/schedule");
            })
            .error(function(e){
               console.log(e);
               alert("Failed to update record. Please try again");

          });
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


    vm.copySubOne=function(daySchedule){
      vm.selectedCopyDay= vm.getSelectedDayId(daySchedule.Day);
      vm.copiedTimeSlots = vm.classSchedule.Days[vm.selectedCopyDay].TimeSlots;

    }

    vm.pasteSubOne=function(daySchedule){
      vm.selectedPasteDay= vm.getSelectedDayId(daySchedule.Day);
      if(vm.copiedTimeSlots!=null && vm.copiedTimeSlots.length > 0)
      {
        vm.classSchedule.Days[vm.selectedPasteDay].TimeSlots= vm.copiedTimeSlots;
      }

    }

    vm.removeSub=function(daySchedule,subSch,index){

        vm.selectedDay=vm.getSelectedDayId(daySchedule.Day);;
        //for(var i=0;i< vm.classSchedule.Days[vm.selectedDay].TimeSlots.length; i++){
          
          //var currentSlot = vm.classSchedule.Days[vm.selectedDay].TimeSlots[i];
          //if(compareSlots(currentSlot,subSch)){
            //Remove the corresponding element from the array
            vm.classSchedule.Days[vm.selectedDay].TimeSlots.splice(index,1);
            //break;
          //}
        //}
    }

    compareSlots=function(currentSlot,subSch){
      if(currentSlot.StartTime===subSch.StartTime){
        if(currentSlot.EndTime===subSch.EndTime){
          if(currentSlot.SubjectName===subSch.SubjectName){
            return true;
          }
        }
      }
      return false;
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