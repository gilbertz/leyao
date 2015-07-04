'use strict';

angular
  .module('nodejsAngularApp', [
     'ngRoute', 
     'angular-oauth2',
     'angularMoment',
  ])
  .config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/weixin_login', {
        templateUrl: 'views/weixin_login.html',
        controller: 'WeixinLoginCtrl'
      })
      .when('/qrcode', {
        templateUrl: 'views/qrcode.html',
        controller: 'QrcodeCtrl'
      })
      .when('/party_center', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/statis', {
        templateUrl: 'views/statis.html',
        controller: 'StatisCtrl'
      })
      .otherwise({redirectTo: '/'});
  }]).config(['OAuthProvider', function (OAuthProvider) {
    OAuthProvider.configure({
      baseUrl: '/',
      clientId: 'CLIENT_ID',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke'
    });
  }])
  .run(['$rootScope', '$window', 'OAuth', function ($rootScope, $window, OAuth) {

    $rootScope.$on('oauth:error', function (event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' == rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('unauthorized' == rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      if(rejection.status == 401 || rejection.status == 500){
        return $window.location.href = "http://wx.yaoshengyi.com/wx456ffb04ee140d84/launch?rurl=http://web.y1y.me/#/weixin_login";
      }
    });
  }]);
