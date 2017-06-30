 (function () {

  angular
    .module('handbook')
    .controller('schoolCalendarCtrl', schoolCalendarCtrl);

  schoolCalendarCtrl.$inject= ['$location','$modal','$route','handbookData','messaging','authentication'];  
  
  function schoolCalendarCtrl($location,$modal,$route,handbookData,messaging,authentication) {
    var vm = this;
    vm.selectedAll=false;
    vm.schoolId= authentication.schoolId().schoolId;
    vm.selectedIds = {"002": true,"003":false};
    var addMode="ADD_EVENT";
    vm.currentCommand=addMode;
    var modifyMode="MODIFY_EVENT";
    var viewMode="VIEW_EVENT";
    
    vm.pageHeader = {
      title: 'School Events'
    };

    

    vm.checkAll=function(){

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
        
        vm.currentCommand=addMode
        var modalInstance=$modal.open({
            templateUrl:'/schoolCalendar/addCalendarEventModal.view.html',
            controller: 'addEventModalCtrl as vm',
        });

        modalInstance.result.then(function (newEvent) {
            
            //vm.classSchedule.Days[vm.selectedDay].TimeSlots.push(timeSlot);
            vm.currentEvent=newEvent;
            vm.currentEvent.SchoolId=vm.schoolId;
            if(vm.currentCommand===addMode)
            {
              handbookData.addSchoolEvent(vm.currentEvent);
            }
            console.log("Added a new event");
            $route.reload();  
            console.log("Reloaded the current page");

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