angular.module('brandscopicApp.services.permissions')
.service('eventSurveysPermissionsService', function(){
	this.pagePermissions = ['events_surveys'];
	this.elementsVisiblePermissions = {
		'.survey-edit-button': ['events_edit_surveys']
	};
	this.hyperlinksEnabledPermissions = {};
})

.service('eventSurveysAddPermissionsService', function(){
	this.pagePermissions = ['events_create_surveys'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
})

.service('eventSurveysEditPermissionsService', function(){
	this.pagePermissions = ['events_edit_surveys'];
	this.elementsVisiblePermissions = {};
	this.hyperlinksEnabledPermissions = {};
});