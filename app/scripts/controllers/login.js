
angular.module('nodejsAngularApp')
  .controller('LoginCtrl', function ($scope, $http, $location, OAuth) {
    $scope.send = function() {
      return $location.url('/statis');
    };

    $scope.login = function () {

        var user = {
          username: $scope.username,
          password: $scope.password
        }

        OAuth.getAccessToken(user, {}).then(function (response) {
          $location.path("main")
          loginModal.modal('hide');

        }).catch(function (response) {
          if (response.status == 401 || response.status == 400) {
            $scope.error = "login"
          } else {
            $scope.error = "unknown"
          }
        })
      };

    var loginModal = $('.loginModal').modal('setting', {
      closable: false,
     onApprove: $scope.login
    });

    loginModal.modal('show');

  });
