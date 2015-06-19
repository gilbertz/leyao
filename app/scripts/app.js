'use strict';

/**
 * @ngdoc overview
 * @name nodejsAngularApp
 * @description
 * # nodejsAngularApp
 *
 * Main module of the application.
 */
angular
  .module('nodejsAngularApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
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
      .otherwise({
        redirectTo: '/login'
      });
  });
