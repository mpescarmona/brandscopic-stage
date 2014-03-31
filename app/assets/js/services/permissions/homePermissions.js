angular.module('brandscopicApp.services.permissions')
.service('homePermissionsService', function(){
	this.pagePermissions = [];
	this.elementsVisiblePermissions = {
		'#eventsNavBar': ['events'],
		'#venuesNavBar': ['venues']
		
	};
	this.hyperlinksEnabledPermissions = {};
});