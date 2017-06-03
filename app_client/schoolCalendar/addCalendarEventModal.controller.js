(function () {
angular
    .module('handbook')
    .controller('addEventModalCtrl', addEventModalCtrl);
    
    addEventModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
    
    function addEventModalCtrl ($modalInstance,handbookData,authentication) {
    var vm = this;
    //vm.schoolData = $modalInstance.schoolData;
    vm.formData ={};    
    vm.currentEvent={};
    
    vm.startTimeHour ="";
    vm.startTimeMin ="";

    vm.endTimeHour ="";
    vm.endTimeMin ="";
    vm.selectedSubject=null;
    vm.selectedClasses=[];  
    vm.selectedTeacher={};    

    vm.schoolId = authentication.schoolId().schoolId;

    handbookData.getStudents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.students=data;
      }
    })
    .error(function(e){
        console.log(e);
       // vm.popupAddSchoolForm();
       //alert("School data not found");
    });
    
    handbookData.getClasses(vm.schoolId)
    .success(function(data){
      if(data){
        vm.classes=data;
        updateClasses(vm.classes); 
      }
    });

    var updateClasses=function(classes){
        
        for(var i=0;i<vm.classes.length;i++){
            vm.classes[i].label= vm.classes[i].ClassSection;
        }
    }

    vm.controlSettings = {
        scrollableHeight: '200px',
        scrollable: true,
        enableSearch: true
    };
    
    vm.firedEvents={
      onSelectionChanged: function(){
          updateSelectedStudents();
          //vm.countMessage="Selected Students: "+vm.selectedStudents.length;
          alert("Classes changed");
      }
    };

    var updateSelectedStudents=function(){
      vm.selectedStudentIds=[];
      for(j=0;j<vm.students.length;j++){
      
        //Check if the students class is in selected classes
        for(var i=0;i<vm.selectedClasses.length;i++){
          if(vm.selectedClasses[i].ClassSection===vm.students[j].StudentClassStandard){
            vm.selectedStudentIds.push(vm.students[j].StudentId);
            break;
          }
        }
      };
    }  


        vm.days =['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        
        vm.onSubmit = function () {
            vm.formError = "";
           vm.currentEvent.EventName= vm.eventTitle;
           vm.currentEvent.EventDetail= vm.eventText;
           vm.currentEvent.EventStartTime = vm.startTimeHour+ ':' +vm.startTimeMin;
           vm.currentEvent.EventDate= vm.selectedDay;            
           vm.currentEvent.EventEndTime = vm.endTimeHour+ ':' +vm.endTimeMin;
           vm.currentEvent.EventPlace= vm.eventLocation;
           vm.currentEvent.StudentIDS= vm.selectedStudentIds;      
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