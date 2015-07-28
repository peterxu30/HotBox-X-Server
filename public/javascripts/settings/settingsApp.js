/* Controller for settings */

function settingsController($http, $filter) {
	// $scope.currentGame = 0;
	var vm = this;
	vm.currentGame = 0;
	vm.totalGames;
	vm.settings;
	vm.formData;

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
				vm.settings = $filter('orderBy')(data, "game", false);
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

	function select(gameNumber) {
		vm.currentGame = gameNumber;
		refresh();
	}

	/* Go next game setting if possible */
	function increment() {
		if (vm.currentGame < vm.totalGames - 1) {
			select(vm.currentGame + 1);
		}
		refresh();
	}

	/* Go preivous game setting if possible */
	function decrement() {
		if (vm.currentGame > 0) {
			select(vm.currentGame - 1);
		}
		refresh();
	}
}

angular
	.module('settingsApp', [])
	.controller('settingsController', ['$http', '$filter', settingsController]);
