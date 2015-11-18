
var colegios = angular.module('Colegios', ['angular-storage', 'ui.router', 'pascalprecht.translate', 'ngStorage', 'ngCookies', 'angularValidator', 'googleOauth',
    'ngResource'])
        .constant('WSServerCon', 'http://localhost:8080/WSColegios/')
        .constant('OaGoogle', 'https://accounts.google.com/o/oauth2/auth')
        .constant('OaCli', '403175311770-hr19ov9lm3c7moosa3k48581mkn1phle.apps.googleusercontent.com')
        .constant('OaHideCli', '2xnkSIw43FrWGMz7PFpd-ovP')
        .constant('URI_R', 'http://localhost/Colegios/loginG')
        .config(function ($stateProvider, $translateProvider, $httpProvider, TokenProvider) {
            $stateProvider
                    .state('/index', {
                        url: 'index'
                    }).state('/user', {
                url: '/user',
                controller: 'ctrlUser',
                templateUrl: 'pvpages/admin/users.html'
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
                            }
                            else {
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

            TokenProvider.extendConfig({
                clientId: '191261111313.apps.googleusercontent.com',
                redirectUri: '', // allow lunching demo from a mirror
                scopes: ["https://www.googleapis.com/auth/userinfo"]
            });
        });
