angular.module('brandscopicApp.services.permissions')
.service('eventsExpensesPermissionsService', ['UserService', function(UserService) {
	this.pagePermissions = ['events_expenses'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
}]);