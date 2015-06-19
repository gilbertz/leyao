'use strict';

/**
 * @ngdoc function
 * @name nodejsAngularApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the nodejsAngularApp
 */
angular.module('nodejsAngularApp')
  .controller('HomeCtrl', function ($scope,$location) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    $scope.send = function() {
      return $location.url('/login');
    };
  });