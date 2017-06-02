 (function () {

  angular
    .module('handbook')
    .controller('schoolCalendarCtrl', schoolCalendarCtrl);

  schoolCalendarCtrl.$inject= ['$location','$modal','handbookData','messaging'];  
  
  function schoolCalendarCtrl($location,$modal,handbookData,messaging) {
    var vm = this;
    vm.selectedAll=false;
    vm.schoolId= "100";  
    vm.selectedIds = {"002": true,"003":false};
   
    
    vm.pageHeader = {
      title: 'School Calendar'
    };

    

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.events,function(event){
        event.selected=vm.selectedAll;
      })

    }

    vm.onCheckBoxClick =function(eventObj){
     
      var idx = vm.selectedevent.indexOf(eventObj);

      // Is currently selected
      if (idx > -1) {
        vm.selectedevent.splice(idx, 1);
      }

      // Is newly selected
      else {
        vm.selectedevent.push(eventObj);
      }
    }

    

    vm.addEvent=function(){
        
        var modalInstance=$modal.open({
            templateUrl:'/schoolCalendar/addCalendarEventModal.view.html',
            controller: 'addEventModalCtrl as vm',
        });

        modalInstance.result.then(function (timeSlot) {
            
            //vm.classSchedule.Days[vm.selectedDay].TimeSlots.push(timeSlot);
            console.log("Added a new event");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }
    
    vm.edit= function(event){
      
    };
    
    

    vm.deleteEvent=function(){
        for(var eventId in vm.selectedIds){
            
            if(vm.selectedIds[eventId]){
              console.log("To be deleted" + eventId);
            }
        }
    };

    
    //handbookData.getEventsForSchool(vm.schoolId)
    handbookData.getSchoolEvents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.events=data;
        vm.events.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(b.EventDate) - new Date(a.EventDate);
      });
      }
    })
    .error(function(e){
        console.log(e);
        vm.popupAddSchoolForm();
       //alert("School data not found");
    });

  }

})();