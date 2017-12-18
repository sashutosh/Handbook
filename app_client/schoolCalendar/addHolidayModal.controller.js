(function () {
    angular
        .module('handbook')
        .controller('addHolidayModalCtrl', addHolidayModalCtrl);
        
        addHolidayModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
        
        function addHolidayModalCtrl ($modalInstance,handbookData,authentication) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        vm.currentEvent={};
        vm.selectedDay =new Date();
        vm.startTimeHour ="";
        vm.startTimeMin ="";
    
        vm.endTimeHour ="";
        vm.endTimeMin ="";
        vm.selectedSubject=null;
        vm.selectedClasses=[];  
        vm.selectedTeacher={};    
    
        vm.schoolId = authentication.schoolId().schoolId;
    
            
            vm.onSubmit = function () {
                vm.formError = "";
               vm.currentEvent.HolidayDescription= vm.holidayTitle;
               vm.currentEvent.EventDetail= vm.eventText;
               vm.currentEvent.HolidayDate= vm.selectedDay;
               vm.currentEvent.HolidayType= "Holiday";            
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