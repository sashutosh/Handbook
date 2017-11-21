(function () {

  angular
    .module('handbook')
    .controller('editTeacherCtrl', editTeacherCtrl);

  editTeacherCtrl.$inject = ['$location', 'handbookData', 'messaging','authentication'];
  function editTeacherCtrl($location, handbookData, messaging, authentication) {

    var vm = this;
    vm.schoolId = authentication.schoolId().schoolId;
    vm.formDisabled =false;
    var getDefaultTeacher = function () {
      var teacher = {};
      teacher.TeacherFirstName = "";
      teacher.EmailId ="";
      return teacher;
    }
    vm.pagemode = handbookData.getTeacherPageMode();
    if (vm.pagemode === "Edit") {
      vm.pageHeader = {
        title: 'Edit Teacher'
      };
      handbookData.getSelectedTeacher()
        .success(function (data) {
          if (data) {
            vm.teacher = data;
            vm.myFile = {};
            vm.uploadCompleted = false;
            vm.loading = false;
            vm.modeText = "Edit Teacher"
            vm.TeacherDOB = handbookData.formatDOB(vm.teacher.TeacherDOB);
          }
        })
        .error(function (e) {
          console.log(e);
          alert(e);
          vm.showButton = false;
        })
        .finally(function () {
          vm.loading = false;
        });
    }
    else if (vm.pagemode === "Add") {
      vm.teacher = getDefaultTeacher();
      vm.modeText = "Add Teacher"
      vm.pageHeader = {
        title: 'Add Teacher'
      };
    }
    else if (vm.pagemode === "View") {
      vm.formDisabled =true;
      vm.teacher = getDefaultTeacher();
      vm.showButton = false;
      vm.pageHeader = {
        title: 'View Teacher'
      };
      handbookData.getSelectedTeacher()
        .success(function (data) {
          if (data) {
            vm.teacher = data;
            vm.myFile = {};
            vm.loading = false;
            vm.TeacherDOB = handbookData.formatDOB(vm.teacher.TeacherDOB);
          }
        })
        .error(function (e) {
          console.log(e);
          alert(e);
          vm.showButton = false;
        })
        .finally(function () {
          vm.loading = false;
        });
    }

    vm.uploadFile = function (event) {
      vm.loading = true;
      console.log("Image file to upload" + event.target.files[0]);
      var uploadedUrl = handbookData.uploadFile(vm.myFile, '/uploadTeacherOrStudentImage');
      uploadedUrl.then(function (result) {
        console.log("Upload image completed" + result);
        console.log("Uploaded Image url" + result.ImageUrl);
        vm.teacher.ImageUrl = result.ImageUrl;
        vm.loading = false;

      });


    }

    vm.onSubmit = function () {
   
      if (vm.pagemode === "Edit") {
        vm.teacher.TeacherDOB = vm.TeacherDOB;
        handbookData.updateTeacher(vm.teacher)
          .success(function (result) {
            alert("Record updated successfully");
            $location.path("/teachers");
          })
          .error(function (e) {
            console.log(e);
            alert("Failed to update record. Please try again");

          });
      }
      else if(vm.pagemode === "Add"){
        vm.teacher.SchoolId = vm.schoolId;
        handbookData.addTeacher(vm.teacher)
          .success(function (result) {
            alert("Record added successfully");
            $location.path("/teachers");
          })
          .error(function (e) {
            console.log(e);
            alert("Failed to update record. Please try again");

          })
      
      }
    }


  }
})();

