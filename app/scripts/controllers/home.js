
angular.module('nodejsAngularApp')
  .controller('HomeCtrl', function ($scope,$location, $http) {
   $scope.send = function() {
      return $location.url('/login');
    };
  });