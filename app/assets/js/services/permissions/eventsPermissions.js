angular.module('brandscopicApp.services.permissions')
.service('eventsPermissionsService', ['', function(){
	this.pagePermissions = ['events'];
	this.elementsVisiblePermissions = {
		'#edit-event': ['events_edit'],
		'#deactivate-event': ['events_deactivate']
	};
	this.hyperlinksEnabledPermissions = {
		'.events-link': ['events-show']
	};
}])