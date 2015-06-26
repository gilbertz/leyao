angular.module('nodejsAngularApp')
  .controller('WexinLoginCtrl', function ($scope, $http, $timeout, $location, OAuth, $routeParams) {

    if($routeParams.webtoken){
      window.location.href = "http://wx.yaoshengyi.com/wx456ffb04ee140d84/launch?rurl=http://web.y1y.me/#/weixin_login";
    }else($routeParams.webtoken){
      login($routeParams.webtoken);
    }

    var login = function (openid) {
        

        var user = {
          // email: $scope.email,
          // password: $scope.password
          openid: openid
        }

        OAuth.getAccessToken(user, {}).then(function (response) {
           $location.path("/statis")
          
        }).catch(function (response) {
          if (response.status == 401 || response.status == 400) {
            $scope.error = "login"
          } else {
            $scope.error = "unknown"
          }
        })
      };
    

  });