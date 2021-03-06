(function () {
angular
    .module('handbook')
    .controller('addScheduleModalCtrl', addScheduleModalCtrl);
    
    addScheduleModalCtrl.$inject = ['$modalInstance','handbookData','authentication','currentDaySchedule'];
    
    function addScheduleModalCtrl ($modalInstance,handbookData,authentication,currentDaySchedule) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        vm.currentDaySchedule=currentDaySchedule;
        
        vm.startTimeHour ="";
        vm.startTimeMin ="";

        vm.endTimeHour ="";
        vm.endTimeMin ="";
        vm.selectedSubject=null;
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


        vm.days =['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        
        vm.onSubmit = function () {
            vm.formError = "";
           vm.timeSlot.SubjectName=vm.selectedSubject.Subject;
           vm.timeSlot.SubjectId=vm.selectedSubject.SubjectCode;
           vm.startTime = vm.startTimeHour+ ':' +vm.startTimeMin;
           vm.TeacherName = vm.selectedTeacher.TeacherFirstName;
            vm.TeacherId=vm.selectedTeacher.TeacherId;    
           vm.endTime = vm.endTimeHour+ ':' +vm.endTimeMin;

           vm.timeSlot.StartTime=vm.startTime;
           vm.timeSlot.EndTime=vm.endTime;
           vm.timeSlot.TeacherName=vm.TeacherName;
           vm.timeSlot.TeacherId =vm.TeacherId;
           vm.modal.close(vm.timeSlot);
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