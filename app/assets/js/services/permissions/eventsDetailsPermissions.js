angular.module('brandscopicApp.services.permissions')
.service('eventsDetailsPermissionsService', ['UserService', function(UserService) {
	this.pagePermissions = [];
	this.elementsVisiblePermissions = {
		'#people-button': {
			events: ['events_team_members', 'events_contacts'],
			customHandler: function() {
				var elementsShouldBeVisible = false;
				for (var i = 0; i < this.events.length; i++) {
					elementsShouldBeVisible = elementsShouldBeVisible || UserService.permissionIsValid(this.events[i]);
				}

				return elementsShouldBeVisible;
			}
		},
		'#expenses-button': ['events_expenses'],
		'#photos-button': ['events_photos'],
		'#surveys-button': ['events_surveys']
	};
	this.hyperlinksEnabledPermissions = {};
}]);