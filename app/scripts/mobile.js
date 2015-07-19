'use strict';
angular
    .module('nodejsAngularApp', [
        'ui.router',
        'angular-oauth2',
        'oc.lazyLoad'
    ])
    .config(['$stateProvider','$urlRouterProvider','$locationProvider', function ($stateProvider, $urlRouterProvider,$locationProvider) {
        // $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('/home');
        $stateProvider
            .state('home', {
                url:'/home',
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl',
                resolve:{
                    loadHomeCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(["styles/home.css","scripts/controllers/home.js"],{cache:true});
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
                        return $ocLazyLoad.load([{files:['styles/login.css'],cache:true},{files:["scripts/controllers/login.js"],cache:true}]);
                    }]
                }
            })
            .state('weixin_login', {
                url:'/weixin_login?from',
                templateUrl: 'views/weixin_login.html',
                controller: 'WeixinLoginCtrl',
                resolve:{
                    loadWeixinLoginCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load("scripts/controllers/weixin_login.js");
                    }]
                }
            })
            .state('statis', {
                url:'/statis',
                templateUrl: 'views/statis.html',
                controller: 'StatisCtrl',
                resolve:{
                    loadStatisCtrl: ['$ocLazyLoad', function($ocLazyLoad) {
                        return $ocLazyLoad.load(["bower_components/echarts/build/source/echarts-all.js","scripts/controllers/statis.js"]);
                    }]
                }
            })
            .state('component', {
                url:'/component/:type/:activity_uuid/:component_uuid?',
                templateUrl: function($stateParams){
                    var temp = 'views/component/' + $stateParams.type;
                    return temp + '.html';
                },
                controllerProvider:function($stateParams){
                    var type = $stateParams.type;
                    var tempFirst = type.substring(0,1).toUpperCase();
                    var postString = type.substring(1);
                    postString = tempFirst + postString;
                    postString = postString + 'Ctrl';
                    return postString;
                },
                resolve:{
                    loadComponentCtrl: ['$ocLazyLoad','$stateParams', function($ocLazyLoad,$stateParams) {
                        var jsAddress = "scripts/controllers/component/" + $stateParams.type;
                        jsAddress = jsAddress + '.js';
                        var tempcss = 'styles/component/' + $stateParams.type;
                        var cssAddress = tempcss + '.css';
                        var cssAddress1 = tempcss + '.scss';
                        return   $ocLazyLoad.load([jsAddress,cssAddress]) ;//| $ocLazyLoad.load([jsAddress,cssAddress1]);
                    }]
                }
            })
            .state('activity', {
                url:'/activity/:type/:activity_uuid',
                templateUrl: function($stateParams){
                    var temp = 'views/activity/' + $stateParams.type;
                    return temp + '.html';
                },
                controllerProvider:function($stateParams){
                    var type = $stateParams.type;
                    var tempFirst = type.substring(0,1).toUpperCase();
                    var postString = type.substring(1);
                    postString = tempFirst + postString;
                    postString = postString + 'Ctrl';
                    return postString;
                },
                resolve:{
                    loadActivityCtrl: ['$ocLazyLoad','$stateParams', function($ocLazyLoad,$stateParams) {
                        var jsAddress = 'scripts/controllers/activity/' + $stateParams.type;
                        jsAddress = jsAddress + '.js';
                        var tempcss = 'styles/activity/' + $stateParams.type;
                        var cssAddress = tempcss + '.css';
                        var cssAddress1 = tempcss + '.scss';
                        return   $ocLazyLoad.load([jsAddress,cssAddress]) | $ocLazyLoad.load([jsAddress,cssAddress1]);
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
    .run(['$rootScope', '$window', 'OAuth', 'OAuthToken','$state','$location', function ($rootScope,$window, OAuth,OAuthToken,$state,$location) {
       // 不需要登录的路由配置到这里面
        $rootScope.noNeedLogins = new Array('weixin_login','login','home');

        $rootScope.$on('oauth:error', function (event, rejection) {

            // Ignore `invalid_grant` error - should be catched on `LoginController`.
            if ('invalid_grant' === rejection.data.error) {
                return;
            }
            // Refresh token when a `invalid_token` error occurs.
            if ('unauthorized' === rejection.data.error) {
                return OAuth.getRefreshToken();
            }
            if(rejection.status == 500 || rejection.status == 401){
                OAuthToken.removeToken();
                $state.go($state.current.name);
            }
        });
        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){

                if($rootScope.noNeedLogins.indexOf(toState.name) != -1)return;// 如果是进入登录界面则允许
                // 获取到后台回调回来的参数
                var wine = $location.search().wine;
                // 后台登录回调回来
                if(wine){
                    var user = {
                        openid: wine
                    }
                    OAuth.getAccessToken(user, {}).then(function (response) {
                        alert('toState = '+ toState.name);
//                        $state.go(from);
                    }).catch(function (response) {
                        if (response.status === 401 || response.status === 400) {
                            $scope.error = 'login';
                        } else {
                            $scope.error = 'unknown';
                        }
                    })
                }
                // 正常情况下，非后台登录回来
                else{
                    // 如果用户不存在
                    if(!OAuthToken.getAccessToken()){
                        event.preventDefault();// 取消默认跳转行为
                        var lurl = window.location.href;
//                        alert("window" + lurl);
                        var index = lurl.indexOf("#/");
                        lurl = lurl.substr(index + 2);
//                        alert("lrul =" + lurl );
                        // 测试时候用
                        var toUrl = window.location = window.domain+'wx629a5ad4f3fc5f63/launch?rurl=';
                        // 正式坏境用
//                        var toUrl = window.location = window.domain+"wx456ffb04ee140d84/launch?rurl=";

                        return window.location = toUrl + lurl;
                    }
                }
            });
    }]);
