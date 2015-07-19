'use strict';

angular.module('nodejsAngularApp')
  .controller('HomeCtrl', function ($scope,$location) {
        document.title = '乐摇';
   $scope.send = function() {
      return $location.url('/login');
    };
  });