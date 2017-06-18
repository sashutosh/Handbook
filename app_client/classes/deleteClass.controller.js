(function () {
angular
    .module('handbook')
    .controller('deleteClassModalCtrl', deleteClassModalCtrl);
    
    deleteClassModalCtrl.$inject = ['$modalInstance','handbookData','authentication','classSectionMap'];
    
    function deleteClassModalCtrl ($modalInstance,handbookData,authentication,classSectionMap) {
    var vm = this;
    vm.classSectionMap = classSectionMap.currentMap;
    
    vm.Class ={};
    vm.selectedClass="";
    vm.selectedSection="";
    vm.sections=[];

    var getClasses =function(classMap){
        var classList =[];
        for(var i in classMap){
            classList.push(i);
        }
        return classList;
    }

    vm.classes = getClasses(vm.classSectionMap);
    if(vm.classes.length >0){
        vm.selectedClass=vm.classes[0];
    }
    vm.onClassChange = function(){
       vm.sections=vm.classSectionMap[vm.selectedClass];      
    }
    vm.onSubmit = function () {
    
        vm.Class.Class=vm.selectedClass;
        vm.Class.Section =vm.selectedSection;  
        vm.modal.close(vm.Class);
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