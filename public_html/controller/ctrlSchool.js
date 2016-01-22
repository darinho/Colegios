/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlSchool', ['$scope', '$mdDialog', '$mdMedia', '$schools', function ($scope, $mdDialog, $mdMedia, $schools) {
        $.AdminLTE.layout.fixSidebar();

        var bookmark;

        $scope.selected = [];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'txtName',
            limit: 10,
            page: 1
        };

        function getSchools(query) {
            $scope.promise = $schools.getSchool(query).success(function (data) {
                $scope.schools = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getSchools(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getSchools(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddSchool',
                templateUrl: 'pvpages/admin/school/newSchool.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                fullscreen: useFullScreen
            }).then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.delete = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'deleteController',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {schools: $scope.selected},
                templateUrl: 'templates/delete-dialog.html',
            }).then(getSchools);
        };

    }]);

colegios.controller('deleteController', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
        'use strict';

        this.cancel = $mdDialog.cancel;

        function deleteDessert(dessert, index) {
        }

        function onComplete() {
            $mdDialog.hide();
        }

        this.authorizeUser = function () {
        };

    }]);

colegios.controller('ctrlAddSchool', ['$scope', '$mdDialog', 'CountryService', function ($scope, $mdDialog, CountryService) {
        $scope.country = {states: []};
        $scope.state = {cities: []};
        $scope.school = {address: {}};

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
                $scope.school.address.city = JSON.parse(val);
            }
        });

        CountryService.getAll().success(function (data) {
            $scope.loadCountry = false;
            $scope.countries = data;
        }).error(function (data) {

        });
    }]);
