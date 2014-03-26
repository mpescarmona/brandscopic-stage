angular.module('brandscopicApp.services.permissions')
.service('eventsPhotosAddPermissionsService', function(){
	this.pagePermissions = ['events_create_photos'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
});