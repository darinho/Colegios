colegios.controller('ctrlUser', ['$scope', 'CountryService', 'ProfileService', 'UsService', 'DocumentTypeService', function ($scope, CountryService, ProfileService, UsService, DocumentTypeService) {
        $.AdminLTE.layout.fix();
        $.AdminLTE.layout.fixSidebar();
        $scope.school = {
            id: 349
        };

        var user = {
            person: {
                documents: [
                    {}
                ]},
            intDaysChangePwd: 0,
            userProfiles: [
                {
                    school: $scope.school
                }
            ]};
        $scope.user = user;
        $scope.btn = 0;
        $scope.next = [
            "Datos Usuario",
            "Datos Personales",
            "Dirección"
        ];

        $scope.loadProfile = true;
        ProfileService.getAll().success(function (data) {
            $scope.loadProfile = false;
            $scope.profiles = data;
        }).error(function (data) {

        });

        $scope.loadCountry = true;
        DocumentTypeService.getAll().success(function (data) {
            $scope.loadDocumentsTypes = false;
            $scope.documentsTypes = data;
        }).error(function (data) {

        });

        CountryService.getAll().success(function (data) {
            $scope.loadCountry = false;
            $scope.countries = data;
        }).error(function (data) {

        });

        $scope.fillStates = function (s) {
            $scope.states = s.states;
        };

        $scope.fillCities = function (s) {
            $scope.cities = s.cities;
        };

        $scope.saveUser = function (valid) {
            if (valid) {

                UsService.create($scope.user).success(function (data) {
                    $scope.btn = 0;
                    $("#Carousel").carousel(0);
                    $scope.user = user;
                    alert('Guardado');
                }).error(function (data) {
                    alert('Error');
                });
            }
        };

    }]);

colegios.controller('ProfileController', ['$scope', function ($scope) {
        $scope.grid = {
            columns: [
                {name: 'idProfile', text: 'general.id'},
                {name: 'txtDescription', text: 'general.description'},
                {name: 'snActive', text: 'general.activo'}
            ]
        };



        $scope.data = [
            {id: 5, name: 'Dario', birthday: '21-02-1990', lastname: 'Calderon'},
            {id: 6, name: 'Karen', birthday: '21-02-1990', lastname: 'Aguirre'},
            {id: 7, name: 'Wilver', birthday: '21-02-1990', lastname: 'Martinez'}
        ];
    }]);