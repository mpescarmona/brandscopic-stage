angular.module('brandscopicApp.services.permissions')
.service('homePermissionsService', function(){
	this.pagePermissions = [];
	this.elementsVisiblePermissions = {
		'#eventsNavBar': ['events1'],
		'#venuesNavBar': ['venues1']
		
	};
	this.hyperlinksEnabledPermissions = {};
});