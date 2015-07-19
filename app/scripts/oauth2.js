'use strict';
/**
 * angular-oauth2 - Angular OAuth2
 * @version v1.0.2
 * @link https://github.com/seegno/angular-oauth2
 * @license MIT
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([ 'angular', 'query-string' ], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular'), require('query-string'));
    } else {
        root.angularOAuth2 = factory(root.angular, root.queryString);
    }
})(this, function(angular, queryString) {
    var ngModule = angular.module('angular-oauth2', [ 'ng']).config(oauthConfig).factory('oauthInterceptor', oauthInterceptor).provider('OAuth', OAuthProvider).provider('OAuthToken', OAuthTokenProvider);
    function oauthConfig($httpProvider) {
        $httpProvider.interceptors.push('oauthInterceptor');
    }
    oauthConfig.$inject = ['$httpProvider'];
    function oauthInterceptor($q, $rootScope, OAuthToken) {
        return {
            request: function(config) {
                if (OAuthToken.getAuthorizationHeader()) {
                    config.headers = config.headers || {};
                    config.headers.Authorization = OAuthToken.getAuthorizationHeader();
                }
                return config;
            },
            responseError: function(rejection) {
                $rootScope.$emit('oauth:error', rejection);
                if (401 === rejection.status && rejection.data && ('invalid_request' === rejection.data.error || 'invalid_grant' === rejection.data.error)) {
                    OAuthToken.removeToken();
                    $rootScope.$emit("oauth:error", rejection);
                }
                if (401 === rejection.status && rejection.data && 'unauthorized' === rejection.data.error) {
                    $rootScope.$emit('oauth:error', rejection);
                }
                return $q.reject(rejection);
            }
        };
    }
    oauthInterceptor.$inject = [ '$q', '$rootScope', 'OAuthToken'];
    var _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
    };
    var defaults = {
        baseUrl: null,
        clientId: null,
        clientSecret: 'xxx',
        grantPath: '/oauth2/token',
        revokePath: '/oauth2/revoke'
    };
    function OAuthProvider() {
        var config;
        this.configure = function(params) {
            if (config) {
                throw new Error('Already configured.');
            }
            if (!(params instanceof Object)) {
                throw new TypeError('Invalid argument: `config` must be an `Object`.');
            }
            config = angular.extend({}, defaults, params);
            angular.forEach(config, function(value, key) {
                if (!value) {
                    throw new Error('Missing parameter: ' + key + '.');
                }
            });
            if ('/' === config.baseUrl.substr(-1)) {
                config.baseUrl = config.baseUrl.slice(0, -1);
            }
            if ('/' !== config.grantPath[0]) {
                config.grantPath = "/" + config.grantPath;
            }
            if ('/' !== config.revokePath[0]) {
                config.revokePath = '/' + config.revokePath;
            }
            return config;
        };
        this.$get = function($http, OAuthToken, $location) {
            var OAuth = function() {
                function OAuth() {
                    if (!config) {
                        throw new Error('`OAuthProvider` must be configured first.');
                    }
                }
                _prototypeProperties(OAuth, null, {
                    isAuthenticated: {
                        value: function isAuthenticated() {
                            return !!OAuthToken.getToken();
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getAccessToken: {
                        value: function getAccessToken(user, options) {
                            // if (!user || !user.email || !user.password) {
                            //     throw new Error("`user` must be an object with `email and `password` properties.");
                            // }
                            if (!user || !user.openid) {
                                throw new Error('`user` must be an object with `openid` properties.');
                            }
                            // alert(user);
                            // alert(user.openid);
                            var data = queryString.stringify({
                                grant_type: 'password',
                                openid: user.openid
                                // email: user.email,
                                // password: user.password,
                                // scope: "manager"
                            });
                            options = angular.extend({
                                headers: {
                                    "Content-Type": 'application/x-www-form-urlencoded'
                                }
                            }, options);
                         
                            return $http.post('' + config.baseUrl + '' + config.grantPath, data, options).then(function(response) {

                                OAuthToken.setToken(response.data);
                                return response;
                            });
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getRefreshToken: {
                        value: function getRefreshToken() {
                            var data = queryString.stringify({
                                client_id: config.clientId,
                                client_secret: config.clientSecret,
                                grant_type: 'refresh_token',
                                refresh_token: OAuthToken.getRefreshToken()
                            });
                            var options = {
                                headers: {
                                    "Content-Type": 'application/x-www-form-urlencoded'
                                }
                            };
                            return $http.post('' + config.baseUrl + '' + config.grantPath, data, options).then(function(response) {
                                OAuthToken.setToken(response.data);
                                return response;
                            });
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    revokeToken: {
                        value: function revokeToken() {
                            var data = queryString.stringify({
                                token: OAuthToken.getRefreshToken() ? OAuthToken.getRefreshToken() : OAuthToken.getAccessToken()
                            });
                            var options = {
                                headers: {
                                    "Content-Type": 'application/x-www-form-urlencoded'
                                }
                            };
                            return $http.post('' + config.baseUrl + '' + config.revokePath, data, options).then(function(response) {
                                OAuthToken.removeToken();
                                return response;
                            });
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                });
                return OAuth;
            }();
            return new OAuth();
        };
        this.$get.$inject = [ '$http', 'OAuthToken', '$location' ];
    }
    var _prototypeProperties = function(child, staticProps, instanceProps) {
        if (staticProps) Object.defineProperties(child, staticProps);
        if (instanceProps) Object.defineProperties(child.prototype, instanceProps);
    };
    function OAuthTokenProvider() {
        var config = {
            name: 'franky',
            options: {
                secure: true
            }
        };
        this.configure = function(params) {
            if (!(params instanceof Object)) {
                throw new TypeError('Invalid argument: `config` must be an `Object`.');
            }
            angular.extend(config, params);
            return config;
        };
        this.$get = function() {
            var OAuthToken = function() {
                function OAuthToken() {}
                _prototypeProperties(OAuthToken, null, {
                    setToken: {
                        value: function(data) {
                            console.log(JSON.stringify(data))
                            return localStorage.setItem(config.name, JSON.stringify(data));
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getToken: {
                        value: function() {
                            var token = localStorage.getItem(config.name);
                            return JSON.parse(token);
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getAccessToken: {
                        value: function getAccessToken() {
                            return this.getToken() ? this.getToken().access_token : undefined;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getAuthorizationHeader: {
                        value: function getAuthorizationHeader() {
                            if (!(this.getTokenType() && this.getAccessToken())) {
                                return;
                            }
                            return '' + (this.getTokenType().charAt(0).toUpperCase() + this.getTokenType().substr(1)) + ' ' + this.getAccessToken();
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getRefreshToken: {
                        value: function getRefreshToken() {
                            return this.getToken() ? this.getToken().refresh_token : undefined;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    getTokenType: {
                        value: function getTokenType() {
                            return this.getToken() ? this.getToken().token_type : undefined;
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    },
                    removeToken: {
                        value: function removeToken() {
                            return localStorage.removeItem(config.name);
                        },
                        writable: true,
                        enumerable: true,
                        configurable: true
                    }
                });
                return OAuthToken;
            }();
            return new OAuthToken();
        };
        //this.$get.$inject = [ "" ];
    }
    return ngModule;
});
