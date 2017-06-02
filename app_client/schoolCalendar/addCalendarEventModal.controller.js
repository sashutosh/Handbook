(function () {
angular
    .module('handbook')
    .controller('addEventModalCtrl', addEventModalCtrl);
    
    addEventModalCtrl.$inject = ['$modalInstance','handbookData','authentication'];
    
    function addEventModalCtrl ($modalInstance,handbookData,authentication) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        
        
        vm.startTimeHour ="";
        vm.startTimeMin ="";

        vm.endTimeHour ="";
        vm.endTimeMin ="";
        vm.selectedSubject=null;
        vm.selectedClasses=[];  
        vm.selectedTeacher={};    

        vm.timeSlot = {
            subject : "",
            startTime: "",
            endTime:"",

        }
        vm.schoolId = authentication.schoolId();

        handbookData.getSubjects(vm.schoolId.schoolId)
            .success(function(data){
                if(data){
                    vm.subjects=data; 
                }
        });
        
        handbookData.getTeachers(vm.schoolId.schoolId)
            .success(function(data){
                if(data){
                    vm.teachers=data; 
                }
        });  

    handbookData.getClasses(vm.schoolId.schoolId)
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
          //updateSelectedStudents();
          //vm.countMessage="Selected Students: "+vm.selectedStudents.length;
          alert("Classes changed");
      }
    };  


        vm.days =['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        
        vm.onSubmit = function () {
            vm.formError = "";
           vm.timeSlot.SubjectName=vm.subjects[vm.selectedSubject].Subject;
           vm.timeSlot.SubjectId=vm.subjects[vm.selectedSubject].SubjectCode;
           vm.startTime = vm.startTimeHour+ ':' +vm.startTimeMin;
           vm.TeacherName = vm.teachers[vm.selectedTeacher].TeacherFirstName;
           vm.TeacherId=vm.teachers[vm.selectedTeacher].TeacherId;
           vm.endTime = vm.endTimeHour+ ':' +vm.endTimeMin;

           vm.timeSlot.StartTime=vm.startTime;
           vm.timeSlot.EndTime=vm.endTime;
           vm.timeSlot.TeacherName=vm.TeacherName;
           vm.timeSlot.TeacherId =vm.TeacherId;
           vm.modal.close();
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