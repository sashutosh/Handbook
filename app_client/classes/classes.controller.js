(function () {

  angular
    .module('handbook')
    .controller('classCtrl', classCtrl);
  classCtrl.$inject= ['$modal','$route','handbookData','authentication','$location'];  

  function classCtrl($modal,$route,handbookData,authentication, $location) {
    var vm = this;
    var newlyAddedClassList =[];
    var deletedClassList=[];    

    vm.schoolId = authentication.schoolId();
    
    handbookData.getClassesNoCache(vm.schoolId.schoolId)
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

        
    vm.addClass=function(){

        //vm.currentCommand=addMode
        var modalInstance=$modal.open({
            templateUrl:'/classes/addClass.view.html',
            controller: 'addClassModalCtrl as vm',
        });

        modalInstance.result.then(function (newClass) {
            
            newClass.SchoolId = vm.schoolId.schoolId;
            handbookData.addClass(newClass);
            console.log("Added a new class");
            $route.reload();  
            console.log("Reloaded the current page");

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }

    vm.deleteClass=function(){
      var modalInstance=$modal.open({
            templateUrl:'/classes/deleteClass.view.html',
            controller: 'deleteClassModalCtrl as vm',
            resolve : {
                classSectionMap : function() {
                  return {
                    
                    currentMap : vm.classSectionMap
                };
              } 
            }
        });

        modalInstance.result.then(function (timeSlot) {
            
            vm.classSchedule.Days[vm.selectedDay].TimeSlots.push(timeSlot);
            console.log("Added a new timeslot");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });
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