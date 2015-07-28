/* Routes between views */

function routeProvider($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'views/index.html',
			controller: 'homeController'
		})

		.when('/settings', {
        	templateUrl: 'views/settings/display.html',
        	controller: 'settingsController'
      	})
      	
      	.when('/data', {
        	templateUrl: 'views/data/display.html',
        	controller: 'dataController'
      	})
      	
      	.otherwise({
        	redirectTo: '/'
      	});
}

angular
	.module('routesApp', [
		'ngroute',
		'homeController'
		'settings/settingsController',
		'data/dataController'
	])

	.config(['$routeProvider',
		routeProvider]);