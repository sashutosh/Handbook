(function () {

  angular
    .module('handbook')
    .controller('editStudentCtrl', editStudentCtrl);

  editStudentCtrl.$inject = ['$location', 'handbookData', 'messaging', 'authentication'];
  function editStudentCtrl($location, handbookData, messaging, authentication) {



    var getDefaultStudent = function () {
      var student = {};
      student.StudentFirstName = "";
      return student;
    }
    var vm = this;
    vm.myFile = {};
    vm.uploadCompleted = false;
    vm.showButton = true;
    vm.formDisabled =false;
    vm.schoolId = authentication.schoolId().schoolId;
    vm.pagemode = handbookData.getStudentPageMode();

    if (vm.pagemode === "Edit") {
      handbookData.getSelectedStudent()
        .success(function (data) {
          if (data) {

            vm.student = data;
            vm.StudentDOB = handbookData.formatDOB(vm.student.StudentDOB);

            vm.modeText = "Edit Student"
            vm.pageHeader = {
              title: 'Edit Student'
            };

          }
        })
        .error(function (e) {
          console.log(e);
          alert(e);
          vm.modeText = "Edit Student"
          vm.pageHeader = {
            title: 'Edit Student'
          };
          //alert("School data not found");
        })
        .finally(function () {
          vm.loading = false;
        });
    }
    else if (vm.pagemode === "Add") {
      vm.student = getDefaultStudent();
      vm.modeText = "Add Student"
      vm.pageHeader = {
        title: 'Add Student'
      };
    }
    else if (vm.pagemode === "View") {

      vm.formDisabled =true;
      handbookData.getSelectedStudent()
        .success(function (data) {
          if (data) {

            vm.student = data;
            vm.StudentDOB = handbookData.formatDOB(vm.student.StudentDOB);

            vm.showButton = false;
            vm.pageHeader = {
              title: 'View Student'
            };

          }
        })
        .error(function (e) {
          console.log(e);
          alert(e);
          vm.showButton = false;
          vm.pageHeader = {
            title: 'View Student'
          };
          //alert("School data not found");
        })
        .finally(function () {
          vm.loading = false;
        });


    }

    //vm.loading=false;



    //vm.StudentDOB = handbookData.formatDOB(vm.student.StudentDOB);

    vm.onSubmit = function () {
      vm.student.StudentDOB = vm.StudentDOB;
      if (vm.pagemode === "Edit") {
        handbookData.updateStudent(vm.student)
          .success(function (result) {
            alert("Record updated successfully");
            $location.path("/students");
          })
          .error(function (e) {
            console.log(e);
            alert("Failed to update record. Please try again");

          });
      }
      else if (vm.pagemode === "Add") {
        vm.student.SchoolId = vm.schoolId;
        handbookData.addStudent(vm.student)
          .success(function (result) {
            alert("Record added successfully");
            $location.path("/students");
          })
          .error(function (e) {
            console.log(e);
            alert("Failed to update record. Please try again");

          })
      }
    }

    vm.uploadFile = function (event) {
      vm.loading = true;
      console.log("Image file to upload" + event.target.files[0]);
      var uploadedUrl = handbookData.uploadFile(vm.myFile, '/uploadTeacherOrStudentImage');
      uploadedUrl.then(function (result) {
        console.log("Upload image completed" + result);
        console.log("Uploaded Image url" + result.ImageUrl);
        vm.student.ImageUrl = result.ImageUrl;
        vm.loading = false;

      });


    }

  }
})();

