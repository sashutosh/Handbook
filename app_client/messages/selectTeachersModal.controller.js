(function () {
    
      angular
        .module('handbook')
        .controller('selectTeachersModalCtrl', selectTeachersModalCtrl);
      
        selectTeachersModalCtrl.$inject = ['$modalInstance','handbookData','authentication','currentSelectedTeachers'];  
      
      
      function selectTeachersModalCtrl($modalInstance,handbookData,authentication,currentSelectedTeachers) {
        var vm = this;
        vm.teachers=currentSelectedTeachers.teachers;
        
        //Mark all students as selected by default
        var changeSelectionState=function(state){
              angular.forEach(vm.teachers,function(teacher){
              teacher.selected=state;
            })
          }  
        
        var selectedTeachersList =[];
       
        
        vm.checkAll=function(){
    
          // if(!vm.selectedAll){
          //   vm.selectedAll=true
          // }
          // else{
          //   vm.selectedAll=false;
          // }
          changeSelectionState(vm.selectedAll)
    
        }
        
    
        vm.selectedAll=true;
        changeSelectionState(vm.selectedAll);
        vm.modal = {
            close : function (result) {
                $modalInstance.close(result);
            },
            cancel : function () {
                $modalInstance.dismiss('cancel');
            }
        };
        vm.addSelectedStudent=function(){
    
            angular.forEach(vm.teachers,function(teacher){
            if(teacher.selected){
                selectedTeachersList.push(teacher);
            }
          });
          vm.modal.close(selectedTeachersList);
        }
      }
    
    })();