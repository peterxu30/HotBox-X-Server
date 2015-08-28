/*
 * Handles logging in to admin panel.
 */

function loginController($rootScope, $http, $location, $localStorage, jwtHelper, $interval) {
    /* For global use, specifically account authentication across pages */
    $rootScope.$storage = $localStorage;
    $rootScope.$storage.loggedIn = false;
    $rootScope.$storage.token;
    $rootScope.$storage.name;
    $rootScope.logout = logout;

    /* object bindings */
    var vm = this;
    vm.credentials = {
        "name" : "",
        "password" : ""
    };

    /* function bindings */
    vm.login = login;
    vm.logout = logout;
    vm.jwtExpirationChecker = jwtExpirationChecker;

    function jwtExpirationChecker() {
        $interval(function() {
            if ($rootScope.$storage.token != null && jwtHelper.isTokenExpired($rootScope.$storage.token)) {
                console.log("Token has expired: " + jwtHelper.isTokenExpired($rootScope.$storage.token));
                logout();
            }
        }, 7200000);
    }

    /* Checks if login credentials are correct */
    function login() {
        $localStorage.$reset();
        $http.post('/login/authenticate/', vm.credentials)
            .success(function(status) {
                if (status.success) {
                    $rootScope.$storage.token = status.token;
                    $rootScope.$storage.loggedIn = true;
                    $rootScope.$storage.name = vm.credentials.name;
                } else {
                    $rootScope.$storageloggedIn = false;
                } 
            })

            .error(function(token) {
                vm.login = false;
            });
    }

    /* Resets session information on logout */
    function logout() {
        vm.credentials.name = "";
        vm.credentials.password = "";
        $localStorage.$reset();
        $location.path('/');
    }
};

angular
  .module('app', ['ngStorage', 'routesApp', 'angular-jwt'])
  .controller('loginController', ['$rootScope', '$http', '$location', '$localStorage', 'jwtHelper', '$interval', loginController]);
