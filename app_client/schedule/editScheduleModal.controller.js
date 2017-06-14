(function () {
angular
    .module('handbook')
    .controller('editScheduleModalCtrl', editScheduleModalCtrl);
    
    editScheduleModalCtrl.$inject = ['$modalInstance','handbookData','authentication','subSchedule'];
    
    function editScheduleModalCtrl ($modalInstance,handbookData,authentication,subSchedule) {
        var vm = this;
        //vm.schoolData = $modalInstance.schoolData;
        vm.formData ={};    
        vm.timeSlot=subSchedule.slot;
        var splitTime = vm.timeSlot.StartTime.split(':')
        if(splitTime.length===2)
        {
            vm.startTimeHour =splitTime[0];
            vm.startTimeMin =splitTime[1];
        }
        else{
            vm.startTimeHour ="";
            vm.startTimeMin ="";
        }
        splitTime= vm.timeSlot.EndTime.split(':')
        if(splitTime.length===2)
        {
            vm.endTimeHour =splitTime[0];
            vm.endTimeMin =splitTime[1];

        }
        else{
            vm.endTimeHour ="";
            vm.endTimeMin ="";
        }
            
        
        vm.schoolId = authentication.schoolId();

        handbookData.getSubjects(vm.schoolId.schoolId)
            .success(function(data){
                if(data){
                    vm.subjects=data; 
                    vm.selectedSubject = vm.subjects[getSelectedSubject()];
                }
        });

        handbookData.getTeachers(vm.schoolId.schoolId)
            .success(function(data){
                if(data){
                    vm.teachers=data; 
                    vm.selectedTeacher=vm.teachers[getSelectedTeacher()];
                }
        });
        
        getSelectedSubject=function(){
            
            for(var i=0; i < vm.subjects.length; i++)
            {

                if(vm.subjects[i].Subject===vm.timeSlot.SubjectName)
                {
                    return i;
                }
            }
            return 0;
        }

        getSelectedTeacher=function(){
            
            for(var i=0; i < vm.teachers.length; i++)
            {

                if(vm.teachers[i].TeacherFirstName===vm.timeSlot.TeacherName)
                {
                    return i;
                }
            }
            return 0;
        }
        vm.days =['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
        
        
        vm.onSubmit = function () {
        
            vm.formError = "";
            vm.timeSlot.SubjectName=vm.selectedSubject.Subject;
           
            vm.startTime = vm.startTimeHour+ ':' +vm.startTimeMin;
            vm.endTime = vm.endTimeHour+ ':' +vm.endTimeMin;
            vm.TeacherName = vm.selectedTeacher.TeacherFirstName;
            vm.TeacherId=vm.selectedTeacher.TeacherId;    

            vm.timeSlot.StartTime=vm.startTime;
            vm.timeSlot.EndTime=vm.endTime;
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