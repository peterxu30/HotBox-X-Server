/* Routes between views */

function router($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html'
			// controller: 'indexController',
			// controllerAs: 'indexVm'
		})

		.when('/about', {
			templateUrl: 'about.html'
		})

		.when('/settings', {
        	templateUrl: 'settings/display.html',
        	controller: 'settingsController',
        	controllerAs: 'settingsVm',
        	resolve: {
        		checkLoggedIn: function($q, $rootScope) {
					var defer = $q.defer();
					if($rootScope.$storage.loggedIn){
						defer.resolve();
					} else {
						defer.reject("not_logged_in");
					}
					return defer.promise;
				}
			}
      	})
      	
      	.when('/data', {
        	templateUrl: 'data/display.html',
        	controller: 'dataController',
        	controllerAs: 'dataVm',
        	resolve: {
        		checkLoggedIn: function($q, $rootScope){
					var defer = $q.defer();
					if($rootScope.$storage.loggedIn){
						defer.resolve();
					} else {
						defer.reject("not_logged_in");
					}
					return defer.promise;
				}
            }
      	})
      	
      	.otherwise({
        	redirectTo: '/'
      	});
}

function routeController($scope, $location) {
	$scope.$on('$routeChangeError', function(evt,current,previous,rejection){
		if(rejection == "not_logged_in"){
			$location.path("/");
		} 
	});
}

angular
	.module('routesApp', ['ngRoute', 'settingsApp', 'dataApp'])
	.config(['$routeProvider', router])
	.controller('routeController', ['$scope', '$location', routeController]);
