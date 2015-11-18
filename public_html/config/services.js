colegios.service('UsService', function ($http, WSServerCon) {
    var service = this,
            path = "user/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };

    service.update = function (data) {
        return $http({
            url: getUrl() + 'update',
            method: 'PUT',
            data: data
        });
    };

    service.create = function (data) {
        return $http({
            url: getUrl() + 'set',
            method: 'POST',
            data: data
        });
    };

    service.delete = function (data) {
        return $http({
            url: getUrl() + 'delete',
            method: 'PUT',
            data: data
        });
    };

    service.getUrl = function () {
        return getUrl();
    };
});

colegios.service('CountryService', function ($http, WSServerCon) {
    var service = this,
            path = "country/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('StateService', function ($http, WSServerCon) {
    var service = this,
            path = "state/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('CityService', function ($http, WSServerCon) {
    var service = this,
            path = "city/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('ProfileService', function ($http, WSServerCon) {
    var service = this,
            path = "profile/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});

colegios.service('DocumentTypeService', function ($http, WSServerCon) {
    var service = this,
            path = "documenttype/";

    function getUrl() {
        return WSServerCon + path;
    }

    service.getAll = function () {
        return $http.get(getUrl() + 'get');
    };
});