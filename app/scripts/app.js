
angular
  .module('nodejsAngularApp', [
     'ngRoute', 
     'angular-oauth2',
     'angularMoment',
  ])
  .config(['$routeProvider', function ($routeProvider) {
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
      if ('invalid_grant' === rejection.data.error) {
        return;
      }

      // Refresh token when a `invalid_token` error occurs.
      if ('unauthorized' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }

      if(rejection.status == 401){
        return $window.location.href = '/#/login';
      }
    });
  }]);
