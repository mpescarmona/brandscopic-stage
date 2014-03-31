angular.module('brandscopicApp.services.permissions')
.service('eventsPhotosPermissionsService', function(){
	this.pagePermissions = ['events_photos'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
})

.service('eventsPhotosAddPermissionsService', function(){
	this.pagePermissions = ['events_create_photos'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
});