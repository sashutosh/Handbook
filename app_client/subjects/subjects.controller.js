(function () {

  angular
    .module('handbook')
    .controller('subjectCtrl', subjectCtrl);
subjectCtrl.$inject= ['handbookData'];  

  function subjectCtrl(handbookData) {
    var vm = this;
    
    handbookData.getSubjects(vm.schoolId)
    .success(function(data){
      if(data){
        vm.subjects=data; 
      }
    });

    vm.checkAll=function(){

      if(!vm.selectedAll){
        vm.selectedAll=true
      }
      else{
        vm.selectedAll=false;
      }
      angular.forEach(vm.subjects,function(subject){
        subject.selected=vm.selectedAll;
      })

    }
    vm.addSubject=function(){
      vm.subjects.push({
         Subject:"",
         SubjectCode:"" 
      });
    }
    vm.selectedAll=false;

    vm.pageHeader = {
      title: 'School Subjects'
    };
    
  }

})();