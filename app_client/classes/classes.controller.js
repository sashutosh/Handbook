(function () {

  angular
    .module('handbook')
    .controller('classCtrl', classCtrl);
  classCtrl.$inject= ['handbookData','authentication'];  

  function classCtrl(handbookData,authentication) {
    var vm = this;
    var newlyAddedClassList =[];
    var deletedClassList=[];    

    vm.schoolId = authentication.schoolId();
    
    handbookData.getClasses(vm.schoolId.schoolId)
    .success(function(data){
      if(data){
        vm.classes=data; 
      }
    });

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.classes,function(selectedClass){
        selectedClass.selected=vm.selectedAll;
      })

    }
    vm.addClass=function(){
      vm.classes.push({
         Class:"",
         Section:"" 
      });
    }
    vm.deleteClass=function(){
      var newList=[];
      var deleteList=[];
      vm.selectedAll=false;
      angular.forEach(vm.classes,function(selectedClass){
        if(!selectedClass.selected){
           newList.push(selectedClass); 
        }
        else{
          deleteList.push(selectedClass);
        }
      });
      vm.classes=newList;
    }
    vm.selectedAll=false;

    vm.pageHeader = {
      title: 'School Classes'
    };
    
  }

})();