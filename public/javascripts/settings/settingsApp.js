/* Controller for settings */

function settingsController($scope, $http, $filter) {
	var baseData = 
		{
			"game" : null,
			"objectSpawnX" : "800",
			"objectSpeed" : "6",
			"objectWidth" : "18",
			"waveStart" : "480",
			"normalSD" : "1",
			"normalMean" : "1",
			"distribution" : "uniform",
			"gravity" : "14",
			"playerY" : "240",
			"playerX" : "60",
			"playerHeight" : "32",
			"playerWidth" : "32",
			"playerSpeed" : "7.3",
			"minScore" : "0",
			"penaltyValue" : "5",
			"rewardValue" : "1",
			"gameMode" : "penalty"
		};
	$scope.currentGame = 0;
	// $scope.formData = baseData;
	/* Get information to display page */
	$http.get('/settings/')
		.success(function(data) {
			$scope.totalGames = data.length;
			// $scope.settings= $filter('filter')(data, {"game": $scope.currentGame.toString()}, false)[0]; not updating
			$scope.settings = $filter('orderBy')(data, "game", false);
			$scope.formData = $scope.settings[$scope.currentGame];
			console.log(data);
		})

		.error(function(data) {
			console.log("Error: " + data);
		});

	/* Create/update setting */
	$scope.update = function() {
		$http.post('/settings/', $scope.formData)
			.success($scope.$apply(function(data) {
				console.log("Success");
				console.log(formData);
				$scope.formData = {};
				console.log(data);
			}))

			.error(function(data) {
				console.log("Error: " + data);
			});
	};

	/* Delete game setting */
	$scope.delete = function(game) {
		$http.delete('/settings/' + game)
			.success(function(data) {
				$scope.currentGame = max($scope.currentGame - 1, 0);
				console.log(data);
			})

			.error(function(data) {
				console.log(data);
			});
	};

	$scope.select = function(gameNumber) {
		$scope.currentGame = gameNumber;
	}

	/* Go next game setting if possible */
	$scope.increment = function() {
		if ($scope.currentGame < $scope.totalGames - 1) {
			$scope.currentGame += 1;
		}
		$scope.$digest();
	}

	/* Go preivous game setting if possible */
	$scope.decrement = function() {
		if ($scope.currentGame > 0) {
			$scope.currentGame -= 1;
		}
	}
	
}

// function filter() {
//  	return function(items) {  
// 	    items.sort(function(a,b){   
// 	        if (parseInt(a.Sale.id) > parseInt(b.Sale.id))
// 	            return 1;
// 	        if (parseInt(a.Sale.id) < parseInt(b.Sale.id))
// 	            return -1;         
// 	        return 0; 
// 	    });
// 	}
// }

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
	.controller('settingsController', ['$scope', '$http', '$filter', settingsController]);
	// .filter('settingsFilter', [filter]);

