/* 
 * Handles routing between web pages
 */

/* Page router */
function router($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'main.html'
		})

		.when('/about', {
			templateUrl: 'about.html'
		})

		.when('/settings', {
        	templateUrl: 'settings.html',
        	controller: 'settingsController',
        	controllerAs: 'settingsVm',
        	resolve: {
        		checkLoggedIn: function($q, $rootScope) {
					var defer = $q.defer();
					if($rootScope.$storage.loggedIn) {
						defer.resolve();
					} else {
						defer.reject("not_logged_in");
					}
					return defer.promise;
				}
			}
      	})

      	.when('/settings/guide', {
      		templateUrl: 'settingsguide.html',
      		resolve: {
        		checkLoggedIn: function($q, $rootScope) {
					var defer = $q.defer();
					if($rootScope.$storage.loggedIn) {
						defer.resolve();
					} else {
						defer.reject("not_logged_in");
					}
					return defer.promise;
				}
			}
      	})
      	
      	.when('/data', {
        	templateUrl: 'data.html',
        	controller: 'dataController',
        	controllerAs: 'dataVm',
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

      	.when('/account', {
      		templateUrl: 'accounts.html',
        	controller: 'accountsController',
        	controllerAs: 'accountVm',
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

/* 
 * Redirects to home page if not properly authenticated 
 * Code borrowed from Stack Overflow.
 * Source: http://stackoverflow.com/questions/18256106/cancel-route-and-redirect-to-other-route-without-displaying-the-original-content
 */
function routesController($scope, $location) {
	$scope.$on('$routeChangeError', function(evt, current, previous, rejection) {
		if(rejection == "not_logged_in") {
			$location.path("/");
		} 
	});
}

angular
	.module('routesApp', ['ngRoute', 'settingsApp', 'dataApp', 'accountsApp'])
	.config(['$routeProvider', router])
	.controller('routesController', ['$scope', '$location', routesController]);
