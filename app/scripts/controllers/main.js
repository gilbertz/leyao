'use strict';

angular.module('nodejsAngularApp')
  .controller('MainCtrl', function ($scope, $http) {
    $http.get('/api/v1/statis/show')
      .success(function (data) {
        $scope.units = data;
      });
  });
