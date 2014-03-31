angular.module('brandscopicApp.services.permissions')
.service('eventsExpensesPermissionsService', ['UserService', function(UserService) {
	this.pagePermissions = ['events_expenses'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
}])

.service('eventsExpensesAddPermissionsService', ['UserService', function(UserService) {
	this.pagePermissions = ['events_create_expenses'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
}]);