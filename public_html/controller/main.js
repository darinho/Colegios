/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('IndexController', ['$scope', '$translate', '$auth', '$location', '$state', 'toastr', 'UsService', function ($scope, $translate, $auth, $location, $state, toastr, UsService) {
        $scope.langs = getLangs();
        $scope.lan = "es";
        $scope.lg = {user: '', pwd: ''};
        $scope.lang = {"valor": "es", "url": "resources/img/bandera_guate.jpg"};
        $scope.updateLang = function (lan) {
            $scope.lan = lan;
            $translate.use(lan);
        };

        $scope.rutaOpen = "pvpages/login-form.html";
        //$scope.rutaOpen = "pvpages/index.html";

        $scope.menus = [
            {
                id: 1,
                txtName: 'Generales',
                idPadre: 0
            },
            {
                id: 2,
                txtName: 'Recibidos',
                idPadre: 1,
                icon: "resources/img/icons/more_vert.svg"
            },
            {
                id: 3,
                txtName: 'Pospuestos',
                idPadre: 1
            },
            {
                id: 4,
                txtName: 'Completados',
                idPadre: 1
            },
            {
                id: 5,
                txtName: 'Otros',
                idPadre: 0
            },
            {
                id: 6,
                txtName: 'Borradores',
                idPadre: 5
            },
            {
                id: 7,
                txtName: 'Enviados',
                idPadre: 5
            },
            {
                id: 8,
                txtName: 'Recordatorios',
                idPadre: 5
            },
            {
                id: 9,
                txtName: 'Papelera',
                idPadre: 5
            },
            {
                id: 10,
                txtName: 'Spam',
                idPadre: 5
            },
            {
                id: 11,
                txtName: 'Contactos',
                idPadre: 5
            },
            {
                id: 12,
                txtName: 'Gmail',
                idPadre: 5
            }
        ];

        $scope.login = function () {
            UsService.login($scope.lg).success(function (dta) {
                alert(JSON.stringify(dta));
            }).error(function (dta) {
                toastr.error(dta);
            });
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

        $scope.menuSelect = function (branch) {
            $state.go(branch);
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