'use strict';

angular.module('nodejsAngularApp')
  .controller('LoginCtrl', ['$scope','$http','$location','OAuth','$stateParams','$state',function ($scope, $http, $location, OAuth,$stateParams,$state) {
        document.title = '登录';
    $scope.login = function () {
        var user = {
//          email: $scope.email,
//          password: $scope.password
            // 本地测试模拟登录用
            openid:'oRKD0s8stWW-DUiWIKDKV22qaUVI'
        };
        OAuth.getAccessToken(user, {}).then(function (response) {
            var from = $stateParams.from;
            $state.go(from && from !== 'login' ? from : 'main');

        }).catch(function (response) {
          if (response.status === 401 || response.status === 400) {
            $scope.error = 'login';
          } else {
            $scope.error = 'unknown';
          }
        });
      };
  }]);
