(function () {

  angular
    .module('handbook')
    .controller('messageCtrl', messageCtrl);
  messageCtrl.$inject= ['$location','messaging','handbookData','authentication','$modal'];     
  function messageCtrl($location,messaging,handbookData,authentication,$modal) {
    
    var vm = this;
    vm.messageSubject="";
    vm.messageText="";
    vm.messageType="DIARY_NOTE";
    vm.selectedRecipientsObjectList=[];
    vm.selectedRecipients=[];
    vm.selectedRecipientsId=[];
    vm.selectedRecipientsPhoneNumbers=[];
    vm.selectedClasses=[];  
    vm.selectedRecipients= messaging.getSelectedRecipientsList();  
    vm.selectedRecipientsPhoneNumbers=messaging.getSelectedRecipientsPhone();
    vm.selectedRecipientsId= messaging.getSelectedRecipientsId();
    vm.pageHeader = {
      title: 'Messages'
    };
    vm.buttonLabel= {
      buttonDefaultText:'Classes'
    };
    vm.schoolId = authentication.schoolId().schoolId;

    handbookData.getStudents(vm.schoolId)
    .success(function(data){
      if(data){
        vm.students=data;
      }
    })
    .error(function(e){
        console.log(e);
       // vm.popupAddSchoolForm();
       //alert("School data not found");
    });

    handbookData.getClasses(vm.schoolId)
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
          updateSelectedStudents();
          vm.countMessage="Selected Students: "+vm.selectedStudents.length;
      }
    };

    
    var updateSelectedStudents=function(){
      vm.selectedStudents=[];
      for(j=0;j<vm.students.length;j++){
      
        //Check if the students class is in selected classes
        for(var i=0;i<vm.selectedClasses.length;i++){
          if(vm.selectedClasses[i].ClassSection===vm.students[j].StudentClassStandard){
            vm.selectedStudents.push(vm.students[j]);
            break;
          }
        }
      };
    }

    var setPhoneNumbersAndIds=function(selectRecipients){
      //Clear the previous data if any
      vm.selectedRecipientsPhoneNumbers.length=0;
      vm.selectedRecipientsId.length=0;
      vm.selectedRecipients.length=0;

      angular.forEach(selectRecipients,function(selectedObject){
        angular.forEach(selectedObject.StudentParentMobiles,function(mobileNumber){
            vm.selectedRecipientsPhoneNumbers.push(mobileNumber)
        })
        vm.selectedRecipientsId.push(selectedObject.StudentId);
        vm.selectedRecipients.push(selectedObject.StudentFirstName);  
      });
    }
    
    vm.selectRecipients=function(){

      var modalInstance=$modal.open({
            templateUrl:'/messages/selectRecipientsModal.view.html',
            controller: 'selectRecipientsModalCtrl as vm',
            resolve : {
                currentSelectedStudents : function() {
                  return {
                    students : vm.selectedStudents
                };
              } 
            }
          });
          
      modalInstance.result.then(function (selectedStudentsList) {
            
            console.log("Filtered object count ="+ selectedStudentsList.length);    
            vm.selectedStudents=selectedStudentsList;
            vm.countMessage="Selected Students: "+vm.selectedStudents.length;
            console.log("Edited a new timeslot");  

        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        });

    }

    vm.uploadFile=function(event){
    
        vm.loading=true;
        console.log("Image file to upload"+ event.target.files[0]);
        var uploadedUrl= handbookData.uploadFile(vm.myFile,'/uploadTeacherOrStudentImage');
        uploadedUrl.then(function(result){
          console.log("Upload image completed"+result);
          console.log("Uploaded Image url" + result.ImageUrl);
          vm.selectedImageUrl = result.ImageUrl;
          vm.loading=false;    

      });
    }

    vm.send=function(){
        console.log("Sending message");
        setPhoneNumbersAndIds(vm.selectedStudents);
        var msgJsonObject = vm.prepareMessage();
        messaging.sendMessage(msgJsonObject);
      };

    vm.prepareMessage=function(){

        var msgObject={};
        
        msgObject.MessageBody= vm.messageSubject;
        msgObject.MessageTitle= vm.messageSubject;
        msgObject.type=vm.messageType;
        msgObject.FromType=authentication.userRole().userRole;
        msgObject.FromId=authentication.userId().userId;
        msgObject.MobileNumbers=vm.selectedRecipientsPhoneNumbers;
        msgObject.ToIds=vm.selectedRecipientsId;
        return msgObject;  
    };
  }

})();