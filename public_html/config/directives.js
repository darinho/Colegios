
colegios.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
                if (inputValue === undefined)
                    return '';
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});

colegios.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter, {'event': event});
                });

                event.preventDefault();
            }
        });
    };
});



colegios.directive('expandKGrid', ['$window', function ($window) {

        // Define the directive, but restrict its usage to 
        var directive = {
            link: link, // The function attaching the behavior
            restrict: 'A', // Restrict directive to be used only as attribute
            require: 'kendoGrid' // Ensure the directive is set on a <kendo-grid> element
        };
        return directive;


        function link(scope, element, attrs) {
            var gridElement = $(element);

            // Attach an eventHandler to the resize event of the
            // window to resize the data area of the grid accordingly
            $($window).resize(function () {
                // Get the element wrapping the data
                var dataElement = gridElement.find('.k-grid-content');
                // Get all other elements (headers, footers, etc...)
                var nonDataElements = gridElement.children().not('.k-grid-content');
                // Get the height of the whole grid without any borders or margins
                var currentGridHeight = gridElement.innerHeight();
                // Calculate and set the height for the data area, which
                // is the height of the whole grid less the height taken
                // by all non-data content.
                var nonDataElementsHeight = 0;
                nonDataElements.each(function () {
                    nonDataElementsHeight += $(this).outerHeight();
                });
                dataElement.height(currentGridHeight - nonDataElementsHeight);
            });
        }

    }]);

colegios.directive('expandKdGrid', ['$window', function ($window) {

        // Define the directive, but restrict its usage to 
        var directive = {
            link: link // The function attaching the behavior
            //restrict: 'A' // Restrict directive to be used only as attribute
        };
        return directive;


        function link(scope, element, attrs) {
            var gridElement = $(element);
            var idGrid = attrs.id;
            var min = attrs.min ? parseInt(attrs.min) : 250;
            var other = attrs.other ? parseInt(attrs.other) : 0;
            resizeGridM("#" + idGrid, other, min);
            // Attach an eventHandler to the resize event of the
            // window to resize the data area of the grid accordingly
            scope.$watch(
                    function () {
                        return gridElement.parent().height();
                    },
                    function (height) {
                        resizeGridM("#" + idGrid, other, min);
                    });
        }

    }]);

colegios.directive('expandDiv', ['$window', function ($window) {

        // Define the directive, but restrict its usage to 
        var directive = {
            link: link, // The function attaching the behavior
            restrict: 'A' // Restrict directive to be used only as attribute
        };
        return directive;


        function link(scope, element, attrs) {
            var gridElement = $(element);
            var idGrid = attrs.id;
            resizeDivChild(idGrid);
            // Attach an eventHandler to the resize event of the
            // window to resize the data area of the grid accordingly
            $($window).resize(function () {
                // Get the element wrapping the data
                resizeDivChild(idGrid);
            });
            scope.$watch(
                    function () {
                        return gridElement.parent().height();
                    },
                    function (height) {
                        resizeDivChild(idGrid);
                    });
        }

    }]);

colegios.directive('changeModelToNumber', ['$filter', function ($filter) {
        return {
            scope: true,
            restrict: 'A',
            controller: function ($scope) {
                $scope.$watch('r.idPais', function (newVal, oldVal) {
                    $scope.deptos = $filter('filter')($scope.regiones, {idRegionPadre: parseInt(newVal)}, true);
                    $scope.cities = null;
                    if (newVal !== oldVal) {
                        $scope.r.pais = $filter('filter')($scope.regiones, {idRegion: newVal})[0];
                        $scope.r.departamento = null;
                        $scope.r.municipio = null;
                    }
                });

                $scope.$watch('r.idDepartamento', function (newVal, oldVal) {
                    $scope.cities = $filter('filter')($scope.regiones, {idRegionPadre: parseInt(newVal)}, true);
                    if (newVal !== oldVal) {
                        $scope.r.departamento = $filter('filter')($scope.regiones, {idRegion: newVal})[0];
                        $scope.r.municipio = null;
                    }
                });

                $scope.$watch('r.idMunicipio', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        $scope.r.municipio = $filter('filter')($scope.regiones, {idRegion: newVal})[0];
                    }
                });
            }
        };
    }]);


colegios.directive('gridCheckAll', ['$compile', function ($compile) {
        var directive = {
            restrict: 'A',
            scope: true,
            controller: function ($scope) {
                window.crap = $scope;
                $scope.toggleSelectAll = function (ev) {
                    var grid = $(ev.target).closest("[kendo-grid]").data("kendoGrid");
                    var items = grid.dataSource.data();
                    items.forEach(function (item) {
                        item.selected = ev.target.checked;
                    });
                };
            },
            link: function ($scope, $element, $attrs) {
                var options = angular.extend({}, $scope.$eval($attrs.kOptions));
                options.columns.unshift({
                    template: "<input type='checkbox' ng-model='dataItem.selected' />",
                    title: "<input type='checkbox' title='Select all' ng-click='toggleSelectAll($event)' />",
                    width: 50
                });
            }
        };
        return directive;
    }]);