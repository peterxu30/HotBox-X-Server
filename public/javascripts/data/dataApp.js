/* 
 * Handles logic for data page.
 * Displays all data game by game, player by player.
 * Allow csv of all data to be downloaded.
 */

function dataController($rootScope, $http, $filter) {
	$http.defaults.headers.common["x-access-token"] = $rootScope.$storage.token;

	/* object bindings */
	var vm = this;
	vm.data; //al data
	vm.displayData; // Data of current game type
	vm.gamesPlayedCount = []; // keeps track of number of games played per game type
	vm.currentPlayCount; // Value from gamesPlayedCount array, to save time writing later
	vm.totalGamesPlayed; // Sum of values in gamesPlayedCount array. in progress
	vm.currentGameType = 0; 
	vm.totalGameTypes; // total number of game types
	vm.currentGame = 0;

	/* function bindings */
	vm.refresh = refresh;
	vm.remove = remove;
	vm.removeAll = removeAll;
	vm.incrementGameType = incrementGameType;
	vm.decrementGameType = decrementGameType;
	vm.incrementCurrentGame = incrementCurrentGame;
	vm.decrementCurrentGame = decrementCurrentGame;
	vm.download = download;

	/* Get information to display page */
	function refresh() {
		$http.get('/data/')
			.success(function(data) {
				vm.data = data.data;
				//calculate length by filtering by game number and counting length of that.
				vm.totalGameTypes = $filter('orderBy')(vm.data, "-game", false)[0].game;
				vm.displayData = $filter('filter')(vm.data, { "game" : vm.currentGameType }, false);
				vm.gamesPlayedCount[vm.currentGameType] = vm.displayData.length; 
				vm.currentPlayCount = vm.gamesPlayedCount[vm.currentGameType];
			})

			.error(function(data) {
				console.log("Error: " + data);
			});
	}

	/* For switching between game types without refreshing data which can be slow */
	function switchGameType(gameType) {
		vm.displayData = $filter('filter')(vm.data, { "game" : vm.currentGameType }, false);
		vm.gamesPlayedCount[vm.currentGameType] = vm.displayData.length; 
		vm.currentPlayCount = vm.gamesPlayedCount[vm.currentGameType];
	}

	/* First page load */
	refresh();

	/* Delete all game settings for one game type */
	function remove(game, refresh) {
		$http.delete('/data/' + game)
			.success(function(data) {
				if (vm.currentGameType == 0) {
					vm.currentGameType += 1;
				} else {
					vm.currentGameType -= 1;
				}
				vm.currentGame = 0;

				/* For removeAll */
				console.log(data);
				if (refresh) {
					refresh();
				}
			})

			.error(function(data) {
				console.log(data);
			});
	}

	/* Deletes all game settings for ALL game types */
	function removeAll() {
		for (var i = 0; i <= vm.totalGameTypes; i++) {
			remove(i, false);
		}
		vm.currentGameType = 0;
		vm.currentGame = 0;
		refresh();
	}

	/* Converts CSV string into CSV file for download */
	function download() {
		$http.get('/data/csv/')
			.success(function(csv) {
				var saving = document.createElement('a');

			    saving.href = 'data:attachment/csv,' + encodeURIComponent(csv);
			    saving.download = 'data.csv';
			    saving.click();

				console.log(csv);
			})

			.error(function(csv) {
				console.log(csv);
			});	
	}

	/* Go next game type if possible */
	function incrementGameType() {
		if (vm.currentGameType < vm.totalGameTypes) {
			vm.currentGameType += 1;
			switchGameType(vm.currentGameType);
		}
	}

	/* Go preivous game type if possible */
	function decrementGameType() {
		if (vm.currentGameType > 0) {
			vm.currentGameType -= 1;
			switchGameType(vm.currentGameType);
		}
	}

	/* Go next game if possible */
	function incrementCurrentGame() {
		if (vm.currentGame < vm.currentPlayCount - 1) {
			vm.currentGame = vm.currentGame + 1;
		}
	}

	/* Go preivous game if possible */
	function decrementCurrentGame() {
		if (vm.currentGame > 0) {
			vm.currentGame = vm.currentGame - 1;
		}
	}
}

angular
	.module('dataApp', [])
	.controller('dataController', ['$rootScope', '$http', '$filter', dataController]);
