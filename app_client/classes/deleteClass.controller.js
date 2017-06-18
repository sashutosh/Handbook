(function () {
angular
    .module('handbook')
    .controller('deleteClassModalCtrl', deleteClassModalCtrl);
    
    deleteClassModalCtrl.$inject = ['$modalInstance','handbookData','authentication','classSectionMap'];
    
    function deleteClassModalCtrl ($modalInstance,handbookData,authentication,classSectionMap) {
    var vm = this;
    vm.classSectionMap = classSectionMap.currentMap;
    
    vm.Class ={};
    vm.classSection ="";
    vm.className="";
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

    vm.onClassChange = function(){
       vm.sections=vm.classSectionMap[vm.selectedClass];      
    }
    vm.onSubmit = function () {
    
        vm.Class.Class=vm.className;
        vm.Class.Section =vm.classSection;  
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