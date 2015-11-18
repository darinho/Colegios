/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


colegios.controller('MainController', ['$scope', '$translate', 'Token', '$location', '$state', function ($scope, $translate, Token, $location, $state) {
        $scope.accessToken = Token.get();
        function parseKeyValue(/**string*/keyValue) {
            var obj = {}, key_value, key;
            angular.forEach((keyValue || "").split('&'), function (keyValue) {
                if (keyValue) {
                    key_value = keyValue.split('=');
                    key = decodeURIComponent(key_value[0]);
                    obj[key] = angular.isDefined(key_value[1]) ? decodeURIComponent(key_value[1]) : true;
                }
            });
            return obj;
        }

        var queryString = $location.path().substring(1);  // preceding slash omitted
        var params = parseKeyValue(queryString);

        // TODO: The target origin should be set to an explicit origin.  Otherwise, a malicious site that can receive
        //       the token if it manages to change the location of the parent. (See:
        //       https://developer.mozilla.org/en/docs/DOM/window.postMessage#Security_concerns)

        if (window.opener) {
            window.opener.postMessage(params, "*");
            window.close();
        }

        $scope.windows = getWindowsDefault();
        $scope.langs = getLangs();
        $scope.lan = "es";
        $scope.lang = {"valor": "es", "url": "resources/img/bandera_guate.jpg"};
        $scope.updateLang = function (lan) {
            $scope.lan = lan;
            $translate.use(lan);
        };

        $scope.authenticate = function () {
            var extraParams = $scope.askApproval ? {approval_prompt: 'force'} : {};
            Token.getTokenByPopup(extraParams)
                    .then(function (params) {
                        // Success getting token from popup.

                        // Verify the token before setting it, to avoid the confused deputy problem.
                        Token.verifyAsync(params.access_token).
                                then(function (data) {
                                    $rootScope.$apply(function () {
                                        $scope.accessToken = params.access_token;
                                        $scope.expiresIn = params.expires_in;

                                        Token.set(params.access_token);
                                    });
                                }, function () {
                                    alert("Failed to verify token.")
                                });

                    }, function () {
                        // Failure getting token from popup.
                        alert("Failed to get token from popup.");
                    });
        };

        $scope.menuSelect = function (branch) {
            $state.go(branch);
        };
    }]);