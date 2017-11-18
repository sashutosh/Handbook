(function () {
    angular
        .module('handbook')
        .controller('updateScheduleModalCtrl', updateScheduleModalCtrl);
        
        updateScheduleModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
        
        function updateScheduleModalCtrl ($modalInstance,handbookData,authentication) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        
        vm.schoolId = authentication.schoolId().schoolId;

        handbookData.getClasses(vm.schoolId)
        .success(function(data){
          if(data){
            vm.classes=data;
            
          }
        });
    
        var updatechedule=function(){
          
          for(j=0;j<vm.classes.length;j++){
            handbookData.getClassTimetable(vm.classes[j].ClassSection)
            .success(function(data){
               vm.classSchedule=data;
               updateClassTimeTable(vm.classSchedule);    
            });
          }
        }  
    
        var updateClassTimeTable =function(classSchedule){
            
            var updateTime = parseInt(vm.updateTimeMinutes)
            for(var i=0;i<classSchedule.Days.length;i++){
            
                for(var j=0;j<classSchedule.Days[i].TimeSlots.length;j++){

                    var splitTimeStart = classSchedule.Days[i].TimeSlots[j].StartTime.split(':');
                    var t1HourStart=parseInt(splitTimeStart[0]);
                    var t1MinStart=parseInt(splitTimeStart[1]);

                    t1MinStart = t1MinStart + updateTime;
                    if(t1MinStart > 60)
                    {
                        t1MinStart = t1MinStart -60;
                        t1HourStart = t1HourStart +1
                    }
                    classSchedule.Days[i].TimeSlots[j].StartTime = t1HourStart.toString() + ":" + t1MinStart.toString();

                    var splitTimeEnd = classSchedule.Days[i].TimeSlots[j].EndTime.split(':');
                    var t1HourEnd=parseInt(splitTimeEnd[0]);
                    var t1MinEnd=parseInt(splitTimeEnd[1]);

                    t1MinEnd = t1MinEnd + updateTime;
                    if(t1MinEnd > 60)
                    {
                        t1MinEnd = t1MinEnd -60;
                        t1HourEnd = t1HourEnd +1
                    }

                    classSchedule.Days[i].TimeSlots[j].EndTime = t1HourEnd.toString() + ":" + t1MinEnd.toString();

                }
            }
            handbookData.updateTimeTable(classSchedule);

        }
            
            vm.onSubmit = function () {
                updatechedule();
               vm.modal.close(vm.currentEvent);
            };
            
    
            
            vm.modal = {
                
                close : function (result) {
                    $modalInstance.close(result);
                },
                cancel : function () {
                    $modalInstance.dismiss('cancel');
                }
            };
        }
        
    })();