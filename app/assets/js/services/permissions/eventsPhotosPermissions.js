angular.module('brandscopicApp.services.permissions')
.service('eventsPhotosPermissionsService', function(){
	this.pagePermissions = ['events_photos'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
});