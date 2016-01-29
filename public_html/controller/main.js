/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('IndexController', ['$scope', '$translate', '$auth', '$location', '$state', 'toastr', 'UsService', function ($scope, $translate, $auth, $location, $state, toastr, UsService) {
        $scope.langs = getLangs();
        $scope.lan = "es";
        $scope.lg = {user: '', pwd: ''};
        $scope.lang = {"valor": "es", "url": "resources/img/bandera_guate.jpg", "name": "Español"};
        $scope.updateLang = function (ln) {
            $scope.lan = ln.valor;
            $scope.lang = ln;
            $translate.use(ln.valor);
        };

        $scope.menus = [{
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
            }
        ];

        $scope.login = function () {
            UsService.login($scope.lg).success(function (dta) {
                alert(JSON.stringify(dta));
            }).error(function (dta) {
                toastr.error(dta);
            });
        };
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

colegios.controller('LoginController', ['$rootScope', '$scope', 'UsService', '$pantallaS', '$state', '$translate', '$filter', '$localStorage', '$cookies', '$auth', function ($rootScope, $scope, UsService, $pantallaS, $state, $translate, $filter, $localStorage, $cookies, $auth) {

        var ses;
        $rootScope.menuAPP = [];
        $scope.$storage = $localStorage.$default({
            sTkMP: ""
        });

        $scope.langs = [
            {"valor": "es", "url": "resources/img/bandera_guate.jpg"},
            {"valor": "en", "url": "resources/img/bandera_usa.jpg"}
        ];
        if (!$cookies.SesionCollege) {
            $cookies.SesionCollege = '';
            if ($scope.$storage.sTkMP !== "") {
                $cookies.SesionCollege = $scope.$storage.sTkMP;
                UsService.validaSesion('').success(function (data) {
                    if (data) {
                        $scope.$storage.sTkMP = "";
                        $scope.loadInit();
                    } else {
                        $cookies.SesionCollege = "";
                        $scope.$storage.sTkMP = "";
                    }
                }).error(function () {
                    $cookies.SesionCollege = "";
                    $scope.$storage.sTkMP = "";
                });
            }
        } else if ($scope.$storage.sTkMP !== "") {
            $cookies.SesionCollege = $scope.$storage.sTkMP;
            UsService.validaSesion('').success(function (data) {
                if (data) {
                    $scope.$storage.sTkMP = "";
                    $scope.loadInit();
                } else {
                    $cookies.SesionCollege = "";
                    $scope.$storage.sTkMP = "";
                }
            }).error(function () {
                $cookies.SesionCollege = "";
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
        if ($cookies.SesionCollege !== '') {
            ses = JSON.parse($cookies.SesionCollege);
            UsService.usuarioById(ses.idUsuario).success(function (data) {
                $rootScope.islogin = true;
                $rootScope.usuario = data;
                if (!data.snCambioPwd || !data.snCambioPwd2) {
                    $rootScope.menuAPP = [];
                    $state.go('/perfilUser');
                } else {
                    loadMenu(data);
                }
                //document.getElementById('divMain').hidden = false;
            }).error(function () {
                $scope.logout();
            });
        }

        var loadMenu = function (data) {
            $rootScope.profilesU = data.userProfiles;
            if ($rootScope.profilesU.length === 1) {
                if ($rootScope.menuAPP.length === 0) {
                    $pantallaS.pantallaByProfileHtml($rootScope.profilesU[0].profile.idProfile).then(function (result) {
                        $rootScope.menuAPP = JSON.parse(result.data);
                        $scope.validaInicio();
                    });
                } else {
                    $scope.validaInicio();
                }
            } else if ($rootScope.profilesU.length > 1) {

            }
        }

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
                UsService.usuarioBylogin($scope.credentials).success(function (resultU) {
                    var data = resultU;
                    $rootScope.usuario = data.usuario;
                    var user = data.usuario;
                    delete data['usuario'];
                    data.idUsuario = user.idUsuario;
                    data.sUsuario = user.txtUsuario;
                    ses = data;
                    $cookies.SesionCollege = JSON.stringify(ses);
                    $scope.credentials.password = '';
                    $scope.credentials.email = '';
                    if (!user.snCambioPwd || !user.snCambioPwd2) {
                        $rootScope.profilesU = [];
                        $rootScope.profilesU = [];
                        $rootScope.menuAPP = [];
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
                            $scope.model.pass = '';
                            $scope.notf1.show({message: $filter('translate')('login.userIncorrecto')}, "error");
                            $scope.showUser = true;
                            break;
                        case 401:
                            $scope.labelPassRequired = $filter('translate')('login.passIncorrecto');
                            $scope.model.pass = '';
                            $scope.notf1.show({message: $filter('translate')('login.sinConexion')}, "error");
                            break;
                        case 404:
                            $scope.model.pass = '';
                            $scope.showPass = true;
                            $scope.notf1.show({message: $filter('translate')('login.passIncorrecto')}, "error");
                            break;
                        default:
                            $scope.model.pass = '';
                            $scope.notf1.show({message: $filter('translate')('login.internalError')}, "error");
                            break;
                    }
                });
            } else {
                $scope.notf1.show({message: $filter('translate')('general.datos_invalidos')}, "error");
            }
        };
        $scope.logout = function () {
            if ($cookies.SesionCollege.length !== 0) {
                UsService.usuarioLogout(JSON.parse($cookies.SesionCollege));
            }
            $cookies.SesionCollege = '';
            $rootScope.usuario = null;
            ses = null;
            $rootScope.menuAPP = [];
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
                        $rootScope.menuAPP = [];
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
