(function () {

  angular
    .module('handbook')
    .controller('classCtrl', classCtrl);
  classCtrl.$inject= ['handbookData','authentication','$location'];  

  function classCtrl(handbookData,authentication, $location) {
    var vm = this;
    var newlyAddedClassList =[];
    var deletedClassList=[];    

    vm.schoolId = authentication.schoolId();
    
    handbookData.getClasses(vm.schoolId.schoolId)
    .success(function(data){
      if(data){
        vm.classSectionMap={};
        vm.classes=data; 
         for(var i=0;i<vm.classes.length; i++){
            if(!vm.classSectionMap.hasOwnProperty(vm.classes[i].Class)){
              var sections =[];
              sections.push(vm.classes[i].Section);
              vm.classSectionMap[vm.classes[i].Class]= sections;
            }
            else{
               var sections = vm.classSectionMap[vm.classes[i].Class];
               sections.push(vm.classes[i].Section);
               vm.classSectionMap[vm.classes[i].Class]= sections;
            }
          }
          
      
      }
    });



    //vm.classSectionMap = handbookData.getClassSectionMap(vm.schoolId.schoolId);

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
         Section:"",
         SchoolId: vm.schoolId.schoolId
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
    vm.updateClasses=function(){
      
      handbookData.updateClassesList(vm.classes)
            .success(function(result){
              alert("Classes updated successfully");  
              $location.path("/home");
            })
            .error(function(e){
               console.log(e);
               alert("Failed to update record. Please try again");

          });
    }
    vm.selectedAll=false;

    vm.pageHeader = {
      title: 'School Classes'
    };
    
  }

})();