
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

colegios.provider('$dashboardState', function ($stateProvider) {
    this.$get = function (PATHS, $state) {
        return {
            /**
             * @function app.dashboard.dashboardStateProvider.addState
             * @memberof app.dashboard
             * @param {string} title - the title used to build state, url & find template
             * @param {string} controllerAs - the controller to be used, if false, we don't add a controller (ie. 'UserController as user')
             * @param {string} templatePrefix - either 'content', 'presentation' or null
             * @param {string} view
             * @param {string} parent
             * @author Dario Calderon
             * @description adds states to the dashboards state provider dynamically
             * @returns {object} user - token and id of user
             */
            addState: function (title, controllerAs, templatePrefix, view, parent) {
                var objectState = {
                    url: '/' + title,
                    views: {
                    }
                };

                if (parent) {
                    objectState.parent = parent;
                }

                objectState.views[view] = {
                    templateUrl: templatePrefix,
                    controller: controllerAs ? controllerAs : null
                };

                $stateProvider.state('/' + title, objectState);
            }
        }
    }
});
		