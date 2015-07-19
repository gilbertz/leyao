'use strict';
angular
  .module('nodejsAngularApp', [
//        'ngRoute',
      'ui.router',
     'angular-oauth2',
//     'angularMoment',
        'oc.lazyLoad'
  ])
//    .config(['$ocLazyLoadProvider',function($ocLazyLoadProvider){
//        $ocLazyLoadProvider.config({
//            jsLoader: requirejs,
//            debug: true
//        });
//    }])
  .config(['$stateProvider','$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider,$locationProvider) {
    // $locationProvider.html5Mode(true);
        $urlRouterProvider
            .when('/party_center', '/party_center/page1')
            .otherwise('/home');
     $stateProvider
         .state('home', {
             url:'/home',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
             resolve:{
                 loadHomeCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                     return $ocLazyLoad.load(['styles/home.css','scripts/controllers/home.js'],{cache:true});
                 }]
             }
      })
      .state('login', {
             url:'/login?from',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
             resolve:{
                 loadLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                     // you can lazy load files for an existing module
                     return $ocLazyLoad.load([{files:['styles/login.css'],cache:true},{files:['scripts/controllers/login.js'],cache:true}]);
                 }]
             }
      })
         .state('weixin_login', {
             url:'/weixin_login',
             templateUrl: 'views/weixin_login.html',
             controller: 'WeixinLoginCtrl',
                 resolve:{
            loadWeixinLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                return $ocLazyLoad.load('scripts/controllers/weixin_login.js');
            }]
        }
         })
         .state('qrcode', {
             url:'/qrcode?from',
             templateUrl: 'views/qrcode.html',
             controller: 'QrcodeCtrl',
             resolve:{
                 loadLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                     // you can lazy load files for an existing module
                     return $ocLazyLoad.load(['scripts/controllers/qrcode.js']);
                 }]
             }
         })
         .state('main', {
             url:'/party_center',
             templateUrl: 'views/main.html',
             controller: 'MainCtrl',
             resolve:{
                 loadLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                     // you can lazy load files for an existing module
                     return  $ocLazyLoad.load(['scripts/controllers/main.js'],{cache:true});
                 }]
             }

         })
         .state('main.page1', {
             url:'/page1',
             templateUrl: 'views/page1.html',
             onEnter: function(){
//                   alert("on enter");
             },
             onExit: function(){
//                alert("on exit");
             }
         })
         .state('main.page2', {
             url:'/page2',
             templateUrl: 'views/page2.html',
             controller: 'MainCtrl'
         })
         .state('statis', {
             url:'/statis',
             templateUrl: 'views/statis.html',
             controller: 'StatisCtrl',
             resolve:{
                 loadStatisCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                     return $ocLazyLoad.load(['bower_components/echarts/build/source/echarts-all.js','scripts/controllers/statis.js']);
                 }]
             }
         });
  }]).config(['OAuthProvider', function (OAuthProvider) {
    OAuthProvider.configure({
      baseUrl: '/',
      clientId: 'CLIENT_ID',
      grantPath: '/oauth/token',
      revokePath: '/oauth/revoke'
    });
  }])
  .run(['$rootScope', '$window', 'OAuth', 'OAuthToken','$state', function ($rootScope,$window, OAuth,OAuthToken,$state) {
           // 不需要登录的路由配置到这里面
        $rootScope.noNeedLogins = new Array('login','home','qrcode');

    $rootScope.$on('oauth:error', function (event, rejection) {
      // Ignore `invalid_grant` error - should be catched on `LoginController`.
      if ('invalid_grant' === rejection.data.error) {
        return;
      }
      // Refresh token when a `invalid_token` error occurs.
      if ('unauthorized' === rejection.data.error) {
        return OAuth.getRefreshToken();
      }
        // token过期
      if(rejection.status === 500 || rejection.status === 401){
          // 为了方便本地开发 可用第二个,正式坏境用第一个
          $state.go('qrcode',{from:$state.current.name,w:'401'});
//          $state.go("login",{from:$state.current.name,w:'401'});

      }
    });
     $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                // 为了方便本地开发 可用第二个,正式坏境用第一个

                // 正式坏境用
                if($rootScope.noNeedLogins.indexOf(toState.name) !== -1){return;}// 如果是进入登录界面则允许
                // 如果用户不存在
                if(!OAuthToken.getAccessToken()){
                    event.preventDefault();// 取消默认跳转行为
                    $state.go('qrcode',{from:toState.name,w:'notLogin'});//跳转到登录界面
                }

                // 测试可用
//                if($rootScope.noNeedLogins.indexOf(toState.name) != -1)return;// 如果是进入登录界面则允许
//                // 如果用户不存在
//                if(!OAuthToken.getAccessToken()){
//                    event.preventDefault();// 取消默认跳转行为
//                    $state.go("login",{from:toState.name,w:'notLogin'});//跳转到登录界面
//                }


            });
  }]);
