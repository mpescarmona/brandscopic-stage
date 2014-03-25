angular.module('brandscopicApp.services.permissions')
.service('eventsExpensesAddPermissionsService', ['UserService', function(UserService) {
	this.pagePermissions = ['events_create_expenses'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
}]);