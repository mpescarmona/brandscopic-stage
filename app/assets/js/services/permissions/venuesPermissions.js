angular.module('brandscopicApp.services.permissions')
.service('venuesPermissionsService', function(){
	this.pagePermissions = ['venues'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
})

.service('venuesPermissionsAddService', function(){
	this.pagePermissions = ['venues_create'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
});