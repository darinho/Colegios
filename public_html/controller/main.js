/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('IndexController', ['$rootScope', '$scope', '$translate', '$auth', '$location', '$state', 'toastr', 'UsService', '$cookies', function ($rootScope, $scope, $translate, $auth, $location, $state, toastr, UsService, $cookies) {

        var ses;
        if ($cookies.getObject('SesionCollege') && $cookies.getObject('SesionCollege') !== "") {
            ses = $cookies.getObject('SesionCollege');
            $rootScope.user = ses.user;
            $rootScope.profileLoad = ses.userProfile;
        } else {
            $state.go('/login');
        }
        $scope.langs = getLangs();
        $scope.lan = "es";
        $scope.lg = {user: '', pwd: ''};
        $scope.lang = {"valor": "es", "url": "resources/img/bandera_guate.jpg", "name": "Español"};
        $scope.updateLang = function (ln) {
            $scope.lan = ln.valor;
            $scope.lang = ln;
            $translate.use(ln.valor);
        };

        $scope.perfil = function () {
            $state.go('/perfilUser');
        };

        $scope.logout = function () {
            if ($cookies.getObject('SesionCollege')) {
                UsService.usuarioLogout($cookies.getObject('SesionCollege'));
            }
            $cookies.remove('SesionCollege');
            $rootScope.user = null;
            ses = null;
            $rootScope.menu = [];
            $rootScope.profilesU = [];
            $rootScope.islogin = false;
            $state.go('/login');
        };

        $rootScope.menus = [{
                menu: {
                    idMenu: 1,
                    txtName: 'Generales',
                    idParent: 0,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: ""
                }
            },
            {
                menu: {
                    idMenu: 2,
                    txtName: 'Colegios',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "school"
                }
            },
            {
                menu: {
                    idMenu: 3,
                    txtName: 'Perfiles',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "profile"
                }
            },
            {
                menu: {
                    idMenu: 4,
                    txtName: 'Tipos de Documentos',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "documentType"
                }
            },
            {
                menu: {
                    idMenu: 5,
                    txtName: 'Tipos de Licencias',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "licenceType"
                }
            },
            {
                menu: {
                    idMenu: 6,
                    txtName: 'Usuarios',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "user"
                }
            },
            {
                menu: {
                    idMenu: 7,
                    txtName: 'Menu',
                    idParent: 1,
                    txtIcon: "resources/img/icons/more_vert.svg",
                    txtLink: "menu"
                }
            }
        ];
    }]);

colegios.controller('ctrlMenu', ['$scope', function ($scope) {
        $.getScript("resources/material/navbar/script.js")
                .done(function (script, textStatus) {
                    console.log(textStatus);
                })
                .fail(function (jqxhr, settings, exception) {
                    $("div.log").text("Triggered ajaxError handler.");
                });
    }]);

colegios.controller('ctrlSelectProfile', ['$scope', 'pScope', 'profiles', '$mdDialog', function ($scope, pScope, profiles, $mdDialog) {
        $scope.profiles = profiles;

        $scope.select = function (prof) {
            $mdDialog.hide(prof);
        };
    }]);

colegios.controller('LoginController', ['$rootScope', '$scope', 'UsService', '$pantalla', '$state', '$translate', '$filter', '$localStorage', '$cookies', '$mdMedia', '$auth', '$mdDialog', function ($rootScope, $scope, UsService, $pantalla, $state, $translate, $filter, $localStorage, $cookies, $mdMedia, $auth, $mdDialog) {

        var ses;
        $rootScope.menu = [];
        $rootScope.profilesU = [];

        $scope.$storage = $localStorage.$default({
            sTkMP: ""
        });

        $scope.langs = [
            {"valor": "es", "url": "resources/img/bandera_guate.jpg"},
            {"valor": "en", "url": "resources/img/bandera_usa.jpg"}
        ];
        if (!$cookies.getObject('SesionCollege')) {
            if ($scope.$storage.sTkMP !== "") {
                $cookies.putObject('SesionCollege', JSON.parse($scope.$storage.sTkMP));
                UsService.validaSesion('').success(function (data) {
                    if (data) {
                        $scope.$storage.sTkMP = "";
                        $scope.loadInit();
                    } else {
                        $cookies.remove('SesionCollege');
                        $scope.$storage.sTkMP = "";
                    }
                }).error(function () {
                    $cookies.remove('SesionCollege');
                    $scope.$storage.sTkMP = "";
                });
            }
        } else if ($scope.$storage.sTkMP !== "") {
            $cookies.putObject('SesionCollege', JSON.parse($scope.$storage.sTkMP));
            UsService.validaSesion('').success(function (data) {
                if (data) {
                    $scope.$storage.sTkMP = "";
                    $scope.loadInit();
                } else {
                    $cookies.remove('SesionCollege');
                    $scope.$storage.sTkMP = "";
                }
            }).error(function () {
                $cookies.remove('SesionCollege');
                $scope.$storage.sTkMP = "";
            });
        }

        $scope.langs = getLangs();
        $scope.lan = "es";
        $scope.lang = {"valor": "es", "url": "resources/img/bandera_guate.jpg", "name": "Español"};
        $scope.updateLang = function (ln) {
            $scope.lan = ln.valor;
            $scope.lang = ln;
            $translate.use(ln.valor);
        };
        $scope.credentials = {password: '', email: ''};
        var isLogin = false;
        if ($cookies.getObject('SesionCollege')) {
            ses = $cookies.getObject('SesionCollege');
            UsService.validSesion().success(function (resultU) {
                var data = resultU;
                $rootScope.user = data.user;
                var user = data.user;
                data.idUser = user.idUser;
                data.sUser = user.txtUser;
                ses = data;
                if (user.snChangePwd) {
                    $rootScope.profilesU = [];
                    $rootScope.menu = [];
                    $rootScope.islogin = true;
                    $state.go('/perfilUser');
                } else {
                    loadMenu(data);
                }
            }).error(function () {
                $scope.logout();
            });
        }

        var loadMenu = function (data) {
            $rootScope.profilesU = data.userProfiles;
            if (data.userProfile) {
                $rootScope.profileLoad = data.userProfile;
                $cookies.putObject('SesionCollege', data);
                getMenusRemote();
            } else if ($rootScope.profilesU.length > 1) {
                var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
                $mdDialog.show({
                    controller: 'ctrlSelectProfile',
                    templateUrl: 'pvpages/selectProfile.html',
                    parent: angular.element(document.body),
                    locals: {
                        pScope: $scope,
                        profiles: $rootScope.profilesU
                    },
                    clickOutsideToClose: false,
                    fullscreen: useFullScreen
                }).then(function (answer) {
                    $rootScope.profileLoad = answer;
                    delete data.userProfiles;
                    data.userProfile = answer;
                    $cookies.putObject('SesionCollege', data);
                    getMenusRemote();
                }, function () {

                });
                $scope.$watch(function () {
                    return $mdMedia('xs') || $mdMedia('sm');
                }, function (wantsFullScreen) {
                    $scope.customFullscreen = (wantsFullScreen === true);
                });
            }
        };
        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');
        $scope.forgetPass = function (model) {
            $scope.labelPassRequired = $filter('translate')('login.passRequired');
            $scope.labelUserRequired = $filter('translate')('login.userRequired');
            if ($scope.loginForm.usernam.$valid) {

                UsService.forgetMyPass(model.user, $scope.lan).success(function (result) {
                    $scope.notf1.show({message: $filter('translate')(result)}, "success");
                }).error(function (result, status) {
                    $scope.notf1.show({message: $filter('translate')(result)}, "error");
                });
            } else {
                $scope.loginForm.submitted = true;
            }
        };

        function getMenusRemote() {
            if ($rootScope.menu.length === 0) {
                $pantalla.pantallaByUserHtml($rootScope.profileLoad.profile.idProfile).then(function (result) {
                    $rootScope.menu = result.data;
                    $scope.validaInicio();
                });
            } else {
                $scope.validaInicio();
            }
        }

        $scope.checkEnter = function (event) {
            if (event.keyCode === 13) {
                $scope.login($scope.model);
                return false;
            }
        };
        $scope.validaInicio = function () {
            $state.go('/index');
        };

        $scope.login = function () {
            $scope.labelPassRequired = $filter('translate')('login.passRequired');
            $scope.labelUserRequired = $filter('translate')('login.userRequired');
            $scope.showPass = $scope.loginForm.passw.$error.required;
            $scope.showUser = $scope.loginForm.usernam.$error.required;
            if ($scope.loginForm.$valid) {
                UsService.login($scope.credentials).success(function (resultU) {
                    var data = resultU;
                    $rootScope.user = data.user;
                    var user = data.user;
                    data.idUser = user.idUser;
                    data.sUser = user.txtUser;
                    ses = data;
                    $cookies.putObject('SesionCollege', ses);
                    $scope.credentials.password = '';
                    $scope.credentials.email = '';
                    if (user.snChangePwd) {
                        $rootScope.profilesU = [];
                        $rootScope.menu = [];
                        $rootScope.islogin = true;
                        //document.getElementById('divMain').hidden = false;
                        $state.go('/perfilUser');
                    } else {
                        loadMenu(data);
                    }
                }).error(function (data, status) {
                    switch (status) {
                        case 400:
                            $scope.labelUserRequired = $filter('translate')('login.userIncorrecto');
                            $scope.credentials.password = '';
                            $scope.notf1.show({message: $filter('translate')('login.userIncorrecto')}, "error");
                            $scope.showUser = true;
                            break;
                        case 401:
                            $scope.labelPassRequired = $filter('translate')('login.passIncorrecto');
                            $scope.credentials.password = '';
                            $scope.notf1.show({message: $filter('translate')('login.passIncorrecto')}, "error");
                            break;
                        case 404:
                            $scope.credentials.password = '';
                            $scope.showPass = true;
                            $scope.notf1.show({message: $filter('translate')('login.sinConexion')}, "error");
                            break;
                        default:
                            $scope.credentials.password = '';
                            $scope.notf1.show({message: $filter('translate')('login.internalError')}, "error");
                            break;
                    }
                });
            } else {
                $scope.notf1.show({message: $filter('translate')('general.datos_invalidos')}, "error");
            }
        };
        $scope.logout = function () {
            if ($cookies.getObject('SesionCollege')) {
                UsService.usuarioLogout($cookies.getObject('SesionCollege'));
            }
            $cookies.remove('SesionCollege');
            $rootScope.usuario = null;
            ses = null;
            $rootScope.menu = [];
            $rootScope.profilesU = [];
            $rootScope.islogin = false;
            $state.go('/login');
        };

        $scope.loadInit = function () {
            if ($cookies.SesionCollege !== '') {
                ses = JSON.parse($cookies.SesionCollege);
                UsService.usuarioById(ses.idUsuario).success(function (data) {
                    $rootScope.islogin = true;
                    $rootScope.usuario = data;
                    if (!data.snCambioPwd || !data.snCambioPwd2) {
                        $rootScope.menu = [];
                        $rootScope.profilesU = [];
                        $state.go('/perfilUser');
                    } else {
                        loadMenu(data);
                    }
                    $state.go('/index');
                    //document.getElementById('divMain').hidden = false;
                }).error(function () {
                    $scope.logout();
                });
            }
        };

        $scope.authenticate = function (provider) {
            $auth.authenticate(provider)
                    .then(function () {
                        toastr.success('You have successfully signed in with ' + provider + '!');
                        $location.path('/');
                    })
                    .catch(function (error) {
                        if (error.error) {
                            // Popup error - invalid redirect_uri, pressed cancel button, etc.
                            toastr.error(error.error);
                        } else if (error.data) {
                            // HTTP response error from server
                            toastr.error(error.data.message, error.status);
                        } else {
                            toastr.error(error);
                        }
                    });
        };


    }]);
