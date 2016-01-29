/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('ctrlProfile', ['$scope', '$mdDialog', '$mdMedia', '$profiles', function ($scope, $mdDialog, $mdMedia, $profiles) {

        var bookmark;

        $scope.selected = [];

        $scope.filter = {
            options: {
                debounce: 500
            }
        };

        $scope.query = {
            order: 'txtDescription',
            limit: 10,
            page: 1
        };

        function getProfiles(query) {
            $scope.promise = $profiles.getAll(query).then(function (data) {
                $scope.selected = [];
                $scope.profiles = data;
            });
        }

        $scope.onPaginate = function (page, limit) {
            getProfiles(angular.extend({}, $scope.query, {page: page, limit: limit}));
        };

        $scope.onReorder = function (order) {
            getProfiles(angular.extend({}, $scope.query, {order: order}));
        };


        $scope.customFullscreen = $mdMedia('xs') || $mdMedia('sm');

        $scope.addNew = function (ev, dta) {
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            $mdDialog.show({
                controller: 'ctrlAddProfile',
                templateUrl: 'pvpages/admin/profile/newProfile.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                locals: {
                    dataUp: dta
                },
                clickOutsideToClose: false,
                fullscreen: useFullScreen
            }).then(function (answer) {
                getProfiles($scope.query);
            }, function () {

            });
            $scope.$watch(function () {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function (wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        };

        $scope.edit = function (event) {
            $scope.addNew(event, $scope.selected[0]);
        };

        $scope.delete = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ctrlDelProfile',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: {profiles: $scope.selected},
                templateUrl: 'templates/delete-dialog.html'
            }).then(getProfiles);
        };

        $scope.removeFilter = function () {
            $scope.filter.show = false;
            $scope.query.filter = '';

            if ($scope.filter.form.$dirty) {
                $scope.filter.form.$setPristine();
            }
        };

        $scope.$watch('query.filter', function (newValue, oldValue) {
            if (!oldValue) {
                bookmark = $scope.query.page;
            }

            if (newValue !== oldValue) {
                $scope.query.page = 1;
            }

            if (!newValue) {
                $scope.query.page = bookmark;
            }
        });
        getProfiles($scope.query);

    }]);

colegios.controller('ctrlDelProfile', ['$mdDialog', '$scope', function ($mdDialog, $scope) {
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

colegios.controller('ctrlAddProfile', ['$scope', '$mdDialog', '$profiles', 'dataUp', '$filter', function ($scope, $mdDialog, $profiles, dataUp, $filter) {
        if (dataUp) {
            $scope.title = "profile.edit";
            $scope.editing = "md-editing-cl";
            $scope.profile = angular.copy(dataUp);
        } else {
            $scope.title = "profile.new";
        }

        $scope.cancel = function () {
            $mdDialog.cancel();
        };

        $scope.saved = function () {
            $scope.loadingBar = true;
            if ($scope.editing) {
                $profiles.update($scope.profile).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            } else {
                $profiles.create($scope.profile).success(function (data) {
                    $scope.loadingBar = false;
                    $mdDialog.hide(data);
                }).error(function (data) {
                    $scope.loadingBar = false;
                });
            }
        };
    }]);
