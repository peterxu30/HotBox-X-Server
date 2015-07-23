function settingsController($scope, $http) {
	$scope.formData = {};
	$scope.currentGame = 0;

	/* Get information to display page */
	$http.get('/settings/')
		.success(function(data) {
			$scope.totalGames = data.length;
			// $scope.setting = data[$scope.currentGame];
			$scope.setting = $filter('orderBy')(data, "game")[$scope.currentGame];
			console.log(data);
		})

		.error(function(data) {
			console.log("Error: " + data);
		});

	/* Create/update setting */
	$scope.update = function() {
		$http.post('/settings/', $scope.formData)
			.sucess(function(data) {
				$scope.formData = {};
				$scope.setting = data[$scope.currentGame];
				console.log(data);
			})

			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	/* Delete game setting */
	$scope.delete = function(game) {
		$http.delete('/settings/' + game)
			.success(function(data) {
				$scope.currentGame -= 1;
				$scope.setting = data[$scope.currentGame];
				console.log(data);
			})

			.error(function(data) {
				console.log(data);
			});
	};

	/* Go next game setting if possible */
	$scope.increment = function() {
		if ($scope.currentGame < $scope.totalGames - 1) {
			$scope.currentGame += 1;
		}
	}

	/* Go preivous game setting if possible */
	$scope.decrement = function() {
		if ($scope.currentGame > 0) {
			$scope.currentGame -= 1;
		}
	}
	
}

//use orderBy in html to sort
/* Code borrowed from Armin. http://stackoverflow.com/questions/14478106/angularjs-sorting-by-property */
// function filter('orderObjectBy', function() {
// 	return function(input, attribute) {
//     	if (!angular.isObject(input)) {
// 			return input;
//     	}

// 	    var array = [];
// 	    for(var objectKey in input) {
// 	        array.push(input[objectKey]);
// 	    }

// 	    array.sort(function(a, b){
// 	        a = parseInt(a[attribute]);
// 	        b = parseInt(b[attribute]);
// 	        return a - b;
// 	    });
//     	return array;
//  	}
// });

angular
	.module('settingsApp', [])
	.controller('settingsController', settingsController);

