/* 
 * Controller for account page.
 * Handles changing passwords, creating new accounts, and deleting accounts.
 */

function accountsController($rootScope, $http, $filter) {
	$http.defaults.headers.common["x-access-token"] = $rootScope.$storage.token;

	/* object bindings */
	var vm = this;
	vm.statusMessage;
	vm.statusChanged;

	/* function bindings */
	vm.update = update;
	vm.remove = remove;

	/* Change password/Create new account */
	function update(user) {
		$http.post('/users/', user)
			.success(function() {
				changeStatus("Success!");
			})

			.error(function() {
				changeStatus("Update failed!");
			});
	}

	/* Delete game setting */
	function remove(name) {
		$http.delete('/users/' + name)
			.success(function() {
				changeStatus("Account deleted.");
				$rootScope.logout();
			})

			.error(function() {
				changeStatus("Delete failed!");
			});
	}

	/* Change the status message after a change */
	function changeStatus(status) {
		vm.statusMessage = status;
		vm.statusChanged = true;
	}

}

angular
	.module('accountsApp', ['angular-jwt'])
	.controller('accountsController', ['$rootScope', '$http', '$filter', accountsController]);
