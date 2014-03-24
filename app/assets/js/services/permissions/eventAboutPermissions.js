angular.module('brandscopicApp.services.permissions')
.service('eventAboutPermissionsService', function(){
	this.pagePermissions = [];
	this.elementsVisiblePermissions = {
		'#edit-button': ['events_edit1'],
		'#deactivate-button': ['events_deactivate1']
	};
	this.hyperlinksEnabledPermissions = {
	};
});