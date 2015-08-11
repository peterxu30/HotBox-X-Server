
angular
	.module('app', [])
	.run(function($rootScope, $http) {
		  $http.defaults.headers.common['x-access-token'] = $rootScope.token;
		});
