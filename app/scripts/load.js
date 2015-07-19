'use strict';
requirejs.config({
    baseUrl:"/",
        paths: {
        'jquery': '../../bower_components/jquery/dist/jquery',
        'bootstrap': '../../bower_components/bootstrap/js',
        'angular': '../../bower_components/angular/angular',
        'angular-ui-router': '../../bower_components/angular-ui-router/release/angular-ui-router',
        'query-string': '../../bower_components/query-string/query-string',
        'oc.lazyLoad': '../../bower_components/oclazyload/dist/ocLazyLoad',
         'nodejsAngularApp': 'scripts/app'
    },
    shim: {
        'bootstrap': ['jquery'],
        'ui-router': ['angular'],
        'angular-oauth2':['query-string','angular'],
        'oc.lazyLoad': ['angular'],
        'nodejsAngularApp': ['oc.lazyLoad','ui.router','angular-oauth2']
    }
});

//Start the main app logic.
requirejs(['nodejsAngularApp'], function() {
    angular.bootstrap(document.body, ['nodejsAngularApp']);
});
