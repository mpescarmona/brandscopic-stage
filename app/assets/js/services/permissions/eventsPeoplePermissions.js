angular.module('brandscopicApp.services.permissions')
.service('eventsPeoplePermissionsService', function(){
	this.pagePermissions = ['events'];
	this.elementsVisiblePermissions = {
		'#team-button': ['events_team_members'],
		'#contacts-button': ['events_contacts'],
		'.contact-deactivate-button': ['events_delete_contacts'],
		'.contact-edit-button': ['events_edit_contacts']
	};
	this.hyperlinksEnabledPermissions = {};
});