colegios.controller('ctrlUser', ['$scope', 'CountryService', '$profiles', 'UsService', '$userprofile', '$documentsType', '$licenceType', '$mdDialog', '$mdMedia', function ($scope, CountryService, $profiles, UsService, $userprofile, $documentsType, $licenceType, $mdDialog, $mdMedia) {

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'txtFullName',
            limit: 10,
            page: 1
        };

        function getUsers(query) {
            $scope.promise = $userprofile.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.usersProfiles = data.data;
            });
        }

        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddUser',
                templateUrl: 'pvpages/admin/user/newUser.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    pScope: $scope,
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getUsers($scope.query);
            }, function () {

            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.loadProfile = true;
        $profiles.getAll().success(function (data) {
            $scope.loadProfile = false;
            $scope.profiles = data;
        }).error(function (data) {

        });

        $scope.loadLicencesType = true;
        $licenceType.getAll().success(function (data) {
            $scope.loadLicencesType = false;
            $scope.licenceTypes = data;
        }).error(function (data) {

        });

        $scope.loadCountry = true;
        $documentsType.getAll().success(function (data) {
            $scope.loadDocumentsTypes = false;
            $scope.documentsTypes = data;
        }).error(function (data) {

        });

        CountryService.getAll().success(function (data) {
            $scope.loadCountry = false;
            $scope.countries = data;
        }).error(function (data) {

        });
        getUsers($scope.query);

    }]);

colegios.controller('ctrlAddUser', ['$scope', '$mdDialog', 'dataUp', 'pScope', 'UsService', function ($scope, $mdDialog, dataUp, pScope, UsService) {
        $scope.country = {states: []};
        $scope.state = {cities: []};
        $scope.countries = pScope.countries;
        $scope.documentsTypes = pScope.documentsTypes;
        $scope.licenceTypes = pScope.licenceTypes;
        $scope.profiles = pScope.profiles;

        $scope.up = {
            user: {
                person: {
                    documents: [
                        {}
                    ],
                    address: {}
                }
            },
            licence: {
                school: {
                    idSchool: 361
                }
            }
        };

        if (dataUp) {
            $scope.title = "user.edit";
            $scope.editing = "md-editing-cl";
            $scope.up = angular.copy(dataUp);
            var contr = angular.copy($scope.countries);
            $scope.country = $filter('filter')(contr, {idCountry: dataUp.user.person.address.city.state.country.idCountry}, true)[0];
            $scope.state = $filter('filter')($scope.country.states, {idState: dataUp.user.person.address.city.state.idState}, true)[0];
            $scope.up.user.person.address.city = $filter('filter')($scope.state.cities, {idCity: dataUp.user.person.address.city.idCity}, true)[0];
            $scope.countri = JSON.stringify($scope.country);
            $scope.stat = JSON.stringify($scope.state);
            $scope.citi = JSON.stringify($scope.up.user.person.address.city);
        } else {
            $scope.title = "user.new";
        }

        $scope.$watch('countri', function (val) {
            if (val) {
                $scope.country = JSON.parse(val);
            }
        });
        $scope.$watch('stat', function (val) {
            if (val) {
                $scope.state = JSON.parse(val);
            }
        });
        $scope.$watch('citi', function (val) {
            if (val) {
                $scope.up.user.person.address.city = JSON.parse(val);
            }
        });

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saveUser = function (valid) {
            if (valid) {
                $scope.loadingBar = true;
                if ($scope.editing) {
                    UsService.update($scope.up).success(function (data) {
                        $scope.loadingBar = false;
                        $mdDialog.hide(data);
                    }).error(function (data) {
                        $scope.loadingBar = false;
                    });
                } else {
                    UsService.create($scope.up).success(function (data) {
                        $scope.loadingBar = false;
                        $mdDialog.hide(data);
                    }).error(function (data) {
                        $scope.loadingBar = false;
                    });
                }
            }
        };
    }]);

app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file, username: $scope.username},
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
    }]);