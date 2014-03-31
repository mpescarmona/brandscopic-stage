angular.module('brandscopicApp.services.permissions')
.service('eventAboutPermissionsService', function(){
	this.pagePermissions = [];
	this.elementsVisiblePermissions = {
		'#edit-button': ['events_edit'],
		'#deactivate-button': ['events_deactivate']
	};
	this.hyperlinksEnabledPermissions = {
	};
});