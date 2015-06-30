"use strict";

angular.module('nodejsAngularApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/v1/statis/dgbs/1365567608')
      .success(function (data) {
        $scope.units = data;
        alert(data);
      });
  });
