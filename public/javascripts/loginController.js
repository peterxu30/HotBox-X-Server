function loginController($rootScope, $http, $location, $localStorage) {
    var vm = this;
    $rootScope.$storage = $localStorage;
    $rootScope.$storage.loggedIn = false;
    $rootScope.$storage.token;
    $rootScope.$storage.name;
    vm.credentials = {
        "name" : "",
        "password" : ""
    };

    vm.login = login;
    vm.logout = logout;

    function login() {
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

    function logout() {
        vm.credentials.name = "";
        vm.credentials.password = "";
        $localStorage.$reset();
        // $rootScope.$storage.token = "";
        // $rootScope.loggedIn = false;
        $location.path('/');
    }
};

angular
  .module('app', ['ngStorage', 'routesApp'])
  .controller('loginController', ['$rootScope', '$http', '$location', '$localStorage', loginController]);
