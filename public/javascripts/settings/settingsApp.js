/* Controller for settings */

function settingsController($rootScope, $http, $filter) {
	$http.defaults.headers.common["x-access-token"] = $rootScope.$storage.token;

	/* object bindings */
	var vm = this;
	vm.currentGame = 0;
	vm.totalGames;
	vm.settings;
	vm.formData;

	/* function bindings */
	vm.refresh = refresh;
	vm.update = update;
	vm.remove = remove;
	vm.select = select;
	vm.increment = increment;
	vm.decrement = decrement;

	/* Get information to display page */
	function refresh() {
		$http.get('/settings/')
			.success(function(data) {
				vm.totalGames = data.length;
				data = data.settings;
				vm.settings = data;
				/* Sorting done server side now. */
				// vm.settings = $filter('orderBy')(data, "game", false);
				vm.formData = vm.settings[vm.currentGame];
				console.log(data);
			})

			.error(function(data) {
				console.log("Error: " + data);
			});
	}

	/* First page load */
	refresh();

	/* Create/update setting */
	function update() {
		$http.post('/settings/', vm.formData)
			.success(function(data) {
				vm.currentGame = vm.formData.game; //changed from vm.formData["game"] 
				vm.formData = {};
				console.log(data);
				refresh();
			})

			.error(function(data) {
				console.log("Error: " + data);
			});
	}

	/* Delete game setting */
	function remove(game) {
		$http.delete('/settings/' + game)
			.success(function(data) {
				if (vm.currentGame == 0) {
					vm.currentGame += 1;
				} else {
					vm.currentGame -= 1;
				}

				console.log(data);
				refresh();
			})

			.error(function(data) {
				console.log(data);
			});
	}

	/* Go to selected game */
	function select(gameNumber) {
		vm.currentGame = gameNumber;
		refresh();
	}

	/* Go next game setting if possible */
	function increment() {
		if (vm.currentGame < vm.totalGames - 1) {
			select(vm.currentGame + 1);
		} else {
			refresh();
		}
	}

	/* Go preivous game setting if possible */
	function decrement() {
		if (vm.currentGame > 0) {
			select(vm.currentGame - 1);
		} else {
			refresh();
		}
	}
}

angular
	.module('settingsApp', ['angular-jwt'])
	.controller('settingsController', ['$rootScope', '$http', '$filter', settingsController]);
