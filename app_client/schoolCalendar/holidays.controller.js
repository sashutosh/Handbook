(function () {
    
      angular
        .module('handbook')
        .controller('holidayCtrl', holidayCtrl);
    
      holidayCtrl.$inject= ['$location','$modal','$route','handbookData','messaging','authentication'];  
      
      function holidayCtrl($location,$modal,$route,handbookData,messaging,authentication) {
        var vm = this;
        vm.selectedAll=false;
        vm.schoolId= authentication.schoolId().schoolId;
        vm.selectedIds = {"002": false,"003":false};
        var addMode="ADD_EVENT";
        vm.currentCommand=addMode;
        var modifyMode="MODIFY_EVENT";
        var viewMode="VIEW_EVENT";
        
        vm.pageHeader = {
          title: 'Holiday list'
        };
    
        
    
        vm.checkAll=function(){
    
          angular.forEach(vm.holidays,function(event){
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
    
        
    
        vm.addHoliday=function(){
            
            vm.currentCommand=addMode
            var modalInstance=$modal.open({
                templateUrl:'/schoolCalendar/addHolidayModal.view.html',
                controller: 'addHolidayModalCtrl as vm',
            });
    
            modalInstance.result.then(function (newEvent) {
                
                //vm.classSchedule.Days[vm.selectedDay].TimeSlots.push(timeSlot);
                vm.currentEvent=newEvent;
                vm.currentEvent.SchoolId=vm.schoolId;
                if(vm.currentCommand===addMode)
                {
                  handbookData.addSchoolHoliday(vm.currentEvent);
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
        
        vm.remove= function(event){
           var eventId = event.EventId;
           
           handbookData.deleteSchoolEvent(eventId)
                  .success(function(data){
                  if(data){
                        console.log("Event Deleted" + eventId);
                        $location.path('/schoolCalendar');
                       }
                   })
                  .error(function(e){
                         console.log(e);
            
                  });
        };
        
    
        vm.deleteHoliday=function(){
            for(var eventId in vm.selectedIds){
                
                if(vm.selectedIds[eventId]){
                  console.log("To be deleted" + eventId);
                  handbookData.deleteSchoolHolidays(eventId)
                  .success(function(data){
                  if(data){
                        console.log("Event Deleted" + eventId);
                       
                       }
                   })
                  .error(function(e){
                         console.log(e);
            
                  });
    
                }
            }
        };
    
        
        //handbookData.getEventsForSchool(vm.schoolId)
        handbookData.getSchoolHolidays(vm.schoolId)
        .success(function(data){
          if(data){
            vm.holidays=data;
            vm.holidays.sort(function(a,b){
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.HolidayDate) - new Date(a.HolidayDate);
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