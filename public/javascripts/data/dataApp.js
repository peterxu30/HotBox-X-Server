/* Controller for data */

/* 
	Display all data game by game, player by player on HTML like an excel file.
	List events by time stamp.
	Allow csv of all data to be downloaded.
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
	// vm.update = update;
	vm.remove = remove;
	vm.removeAll = removeAll;
	vm.select = select;
	vm.incrementGameType = incrementGameType;
	vm.decrementGameType = decrementGameType;
	vm.incrementCurrentGame = incrementCurrentGame;
	vm.decrementCurrentGame = decrementCurrentGame;
	// vm.JSON2CSV = JSON2CSV;
	vm.download = download;

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

				console.log(data);
				if (refresh) {
					refresh();
				}
			})

			.error(function(data) {
				console.log(data);
			});
	}

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

	/* Deletes all game settings for ALL game types */
	function removeAll() {
		for (var i = 0; i < vm.totalGameTypes; i++) {
			remove(i, false);
		}
		vm.currentGameType = 0;
		refresh();
	}

	function incrementGameType() {
		if (vm.currentGameType < vm.totalGameTypes) {
			vm.currentGameType += 1;
		}
		refresh();
	}

	function decrementGameType() {
		if (vm.currentGameType > 0) {
			vm.currentGameType -= 1;
		}
		refresh();
	}

	/* Go to selected game */
	function select(gameNumber) {
		vm.currentGame = gameNumber;
		refresh();
	}

	/* Go next game setting if possible */
	function incrementCurrentGame() {
		if (vm.currentGame < vm.currentPlayCount - 1) {
			select(vm.currentGame + 1);
		} else {
			refresh();
		}
	}

	/* Go preivous game setting if possible */
	function decrementCurrentGame() {
		if (vm.currentGame > 0) {
			select(vm.currentGame - 1);
		} else {
			refresh();
		}
	}
}

angular
	.module('dataApp', [])
	.controller('dataController', ['$rootScope', '$http', '$filter', dataController]);
