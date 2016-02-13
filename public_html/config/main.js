
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
                                templateUrl: 'pvpages/login-form.html',
                                controller: 'LoginController'
                            }
                        }
                    })
                    .state('user', {
                        url: 'user',
                        parent: "/index",
                        views: {
                            "content": {
                                controller: 'ctrlUser',
                                templateUrl: 'pvpages/admin/user/users.html'
                            }
                        }
                    })
                    .state('school', {
                        url: 'school',
                        parent: '/index',
                        views: {
                            "content": {
                                controller: 'ctrlSchool',
                                templateUrl: 'pvpages/admin/school/school.html'
                            }
                        }
                    })
                    .state('licenceType', {
                        url: 'lt',
                        parent: '/index',
                        views: {
                            "content": {
                                controller: 'ctrlLicenceType',
                                templateUrl: 'pvpages/admin/licenceType/licenceType.html'
                            }
                        }
                    })
                    .state('documentType', {
                        url: 'dt',
                        parent: '/index',
                        views: {
                            "content": {
                                controller: 'ctrlDocumentType',
                                templateUrl: 'pvpages/admin/documentType/documentType.html'
                            }
                        }
                    })
                    .state('profile', {
                        url: 'profile',
                        parent: '/index',
                        views: {
                            "content": {
                                controller: 'ctrlProfile',
                                templateUrl: 'pvpages/admin/profile/profile.html'
                            }
                        }
                    })
                    .state('menu', {
                        url: 'menu',
                        parent: '/index',
                        views: {
                            "content": {
                                controller: 'ctrlMenus',
                                templateUrl: 'pvpages/admin/menu/menu.html'
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
                        if ($cookies.getObject('SesionCollege')) {
                            var ses = $cookies.getObject('SesionCollege');

                            if (config.params === undefined) {
                                config.params = {'token': ses.token, 'idUser': ses.idUser, 'idSession': ses.idUserSession, 'sUser': ses.sUser};
                                if(ses.profile){
                                    config.params.idProfileC = ses.profile;
                                }
                            } else {
                                config.params.idUser = ses.idUser;
                                config.params.token = ses.token;
                                config.params.idSession = ses.idUserSession;
                                config.params.sUser = ses.sUser;
                                if(ses.profile){
                                    config.params.idProfileC = ses.profile;
                                }
                            }
                        }
                        return config;
                    },
                    'response': function (response) {
                        return response;
                    }
                };
            });

            $authProvider.baseUrl = '/Colegios/';

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

colegios.run(['$state', function ($state) {
        $state.transitionTo('/index');
    }]);