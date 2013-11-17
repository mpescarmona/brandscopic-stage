'use strict';

/* Services */

angular.module('brandscopicApp.services', [])
.service('UserService', function() {
	this.currentUser = {
		isLogged: false,
		email: ''
	};
	this.isLogged = function() {
		return this.currentUser.isLogged;
	};
})

.value('version', '0.1')
.value('loginPage', '/login');
