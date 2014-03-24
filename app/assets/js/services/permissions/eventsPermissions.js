angular.module('brandscopicApp.services.permissions')
.service('eventsPermissionsService', function(){
	this.pagePermissions = ['events'];
	this.elementsVisiblePermissions = {
		'.edit-event': ['events_edit1'],
		'.deactivate-event': ['events_deactivate1']
	};
	this.hyperlinksEnabledPermissions = {
		'.events-link': ['events-show1']
	};
});