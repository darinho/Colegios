
var colegios = angular.module('Colegios', ['angular-storage', 'ui.router', 'pascalprecht.translate', 'ngStorage', 'ngCookies', 'angularValidator', 'satellizer', 'ngResource', 'toastr', 'ngMaterial', 'md.data.table'])
        .constant('WSServerCon', 'http://localhost:8080/WSColegios/')
        .constant('OaGoogle', 'https://accounts.google.com/o/oauth2/auth')
        .constant('OaCli', '403175311770-hr19ov9lm3c7moosa3k48581mkn1phle.apps.googleusercontent.com')
        .constant('OaHideCli', '2xnkSIw43FrWGMz7PFpd-ovP')
        .constant('URI_R', 'http://localhost/Colegios/loginG')
        .config(function ($stateProvider, $translateProvider, $httpProvider, $authProvider, $mdThemingProvider) {
            $stateProvider
                    .state('/index', {
                        url: '/',
                        views: {
                            "index": {
                                templateUrl: 'pvpages/index.html',
                                controller: 'IndexController'
                            }
                        }
                    })
                    .state('/login', {
                        url: '/login',
                        views: {
                            "index": {
                                templateUrl: 'pvpages/login-form.html'
                            }
                        }
                    })
                    .state('/user', {
                        url: '/user',
                        controller: 'ctrlUser',
                        templateUrl: 'pvpages/admin/users.html'
                    })
                    .state('/school', {
                        url: '/school',
                        views: {
                            "content": {
                                controller: 'ctrlSchool',
                                templateUrl: 'pvpages/admin/school/school.html'
                            }
                        }
                    });

            $translateProvider.useStaticFilesLoader({
                prefix: 'lan/',
                suffix: '.json'
            });
            $translateProvider.preferredLanguage('es');

            $httpProvider.interceptors.push(function ($q, $cookies) {
                return {
                    'request': function (config) {
                        if ($cookies.Sesion !== undefined && $cookies.Sesion !== null && $cookies.Sesion !== "") {
                            var ses = JSON.parse($cookies.Sesion);

                            if (config.params === undefined) {
                                config.params = {'token': ses.txtToken, 'idUsuario': ses.idUsuario};
                            } else {
                                config.params.idUsuario = ses.idUsuario;
                                config.params.token = ses.txtToken;
                            }
                        }
                        return config;
                    },
                    'response': function (response) {
                        return response;
                    }
                };
            });

            $authProvider.baseUrl = '/Colegios';

            $authProvider.google({
                clientId: '403175311770-hr19ov9lm3c7moosa3k48581mkn1phle.apps.googleusercontent.com',
                redirectUri: window.location.origin + '/Colegios/oauth2callback.html'
            });

            function skipIfLoggedIn($q, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.reject();
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            }

            function loginRequired($q, $location, $auth) {
                var deferred = $q.defer();
                if ($auth.isAuthenticated()) {
                    deferred.resolve();
                } else {
                    $location.path('/login');
                }
                return deferred.promise;
            }

            $mdThemingProvider.theme('default')
                    .primaryPalette('blue');

        });
