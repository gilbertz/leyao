"use strict";
angular.module('nodejsAngularApp')
  .controller('WeixinLoginCtrl', function ($rootScope,$scope, $http, $timeout, $location, OAuth,OAuthToken,$state,$stateParams) {
    var login = function (openid) {

        var user = {
          // email: $scope.email,
          // password: $scope.password
          openid: openid
        }
        OAuth.getAccessToken(user, {}).then(function (response) {
        // alert(rurl);
        window.location.href = localStorage.getItem("murl");

          // window.location.href = localstorage.rurlx;
          //location.path 相对路径
          // $location.path(window.rurl); 

        }).catch(function (response) {
          if (response.status == 401 || response.status == 400) {
            $scope.error = "login";
          } else {
            $scope.error = "unknown";
          }
        })
      };

//        alert($stateParams.id);
//        alert($state.id);
//        $location.search().webtoken
    if(!$location.search().webtoken){
      // login("oNnqbt0tR5uMo8LNVM0_8upfRkeo");

        // alert("no webtoken");
        // alert(window.domain);
//        wx456ffb04ee140d84
//        wx629a5ad4f3fc5f63
      window.location.href = window.domain+"wx456ffb04ee140d84/launch?rurl="+"http://web.y1y.me/#/weixin_login";
//      window.location.href = window.domain + "wx456ffb04ee140d84/launch?rurl=http://web.y1y.me/%23/statis";

    }else{
      alert("haha");
      login($location.search().webtoken);
    };


  });
