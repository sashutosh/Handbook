(function () {
    
      angular
        .module('handbook')
        .controller('teachermessageCtrl', teachermessageCtrl);
        teachermessageCtrl.$inject= ['$location','messaging','handbookData','authentication','$modal'];     
      function teachermessageCtrl($location,messaging,handbookData,authentication,$modal) {
        
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
    
        handbookData.getTeachers(vm.schoolId)
        .success(function(data){
          if(data){
            vm.teachers=data;
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
    
            
        var setPhoneNumbersAndIds=function(selectRecipients){
          console.log("inside selectRecipients");
          console.log(selectRecipients.length);
          //Clear the previous data if any
          vm.selectedRecipientsPhoneNumbers.length=0;
          vm.selectedRecipientsId.length=0;
          vm.selectedRecipients.length=0;
          console.log(vm.selectedRecipientsPhoneNumbers.length);
          console.log(vm.selectedRecipientsId.length);
          console.log(vm.selectedRecipients.length);
          angular.forEach(selectRecipients,function(selectedObject){
            angular.forEach(selectedObject.StudentParentMobiles,function(mobileNumber){
                vm.selectedRecipientsPhoneNumbers.push(mobileNumber)
            })
            vm.selectedRecipientsId.push(selectedObject.StudentId);
            vm.selectedRecipients.push(selectedObject.StudentFirstName);  
          });
          console.log(vm.selectedRecipientsPhoneNumbers.length);
          console.log(vm.selectedRecipientsId.length);
          console.log(vm.selectedRecipients.length);
        }
        
        vm.selectRecipients=function(){
    
          var modalInstance=$modal.open({
                templateUrl:'/messages/selectTeachersModal.view.html',
                controller: 'selectTeachersModalCtrl as vm',
                resolve : {
                  currentSelectedTeachers : function() {
                      return {
                        teachers : vm.teachers
                    };
                  } 
                }
              });
              
          modalInstance.result.then(function (selectedTeachersList) {
                
                console.log("Filtered object count ="+ selectedTeachersList.length);    
                vm.selectedTeachers=selectedTeachersList;
                vm.countMessage=vm.selectedTeachers.length + " selected";
   
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
            var selectedstudentcount =0;
            var selected20batch = 0;
            var selectedstudentbatch = [];
            //alert(vm.selectedStudents.length);
            for(selectedteachercount = 0; selectedteachercount < vm.selectedTeachers.length; selectedteachercount++ ){
              if(selected20batch <20)
              {
                selected20batch = selected20batch + 1;
                selectedstudentbatch.push(vm.selectedTeachers[selectedstudentcount]);
              }
              if(selected20batch == 20){
                //alert("insise 20");
                //setPhoneNumbersAndIds(selectedstudentbatch);
                var msgJsonObject = vm.prepareMessage(selectedstudentbatch);
                console.log(msgJsonObject);
                //alert(msgJsonObject);
                messaging.sendMessage(msgJsonObject);
                selected20batch =0;
                selectedstudentbatch.length = 0;
              }
            }
            if(selected20batch !=0 && selectedstudentbatch.length != 0){
            //setPhoneNumbersAndIds(selectedstudentbatch);
            var msgJsonObject = vm.prepareMessage(selectedstudentbatch);
            console.log(msgJsonObject);
            //alert(msgJsonObject);
            messaging.sendMessage(msgJsonObject);
            selected20batch =0;
            selectedstudentbatch.length = 0;
            }
            $location.path("/inbox")  
          };
    
        vm.prepareMessage= function(selectedstudentbatch){
            
    
            var msgObject={};
             
            var mobiles = [];
            var ToIds = [];
            var ToNames = [];
            angular.forEach(selectedstudentbatch,function(selectedObject){
              angular.forEach(selectedObject.StudentParentMobiles,function(mobileNumber){
                mobiles.push(mobileNumber)
              })
              mobiles.push(selectedObject.MobileNumbers)
              ToIds.push(selectedObject.TeacherId);
              ToNames.push(selectedObject.TeacherFirstName);  
            });
            
            msgObject.MessageBody= vm.messageText;
            msgObject.MessageTitle=vm.messageSubject;
            msgObject.type=vm.messageType;
            msgObject.FromType=authentication.userRole().userRole;
            msgObject.FromId=authentication.userId().userId;
            msgObject.FromName=authentication.currentUser().name; 
            msgObject.MobileNumbers=mobiles;
            msgObject.ToIds=ToIds;
            msgObject.ToNames=ToNames;
            msgObject.ImageUrl= vm.selectedImageUrl;
            return msgObject;  
        };
      }
    
    })();