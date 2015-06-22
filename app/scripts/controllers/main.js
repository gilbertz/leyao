
angular.module('nodejsAngularApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/product_units')
      .success(function (data) {
        $scope.units = data;
        alert(data);
      });
  });
