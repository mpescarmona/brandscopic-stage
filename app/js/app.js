'use strict';


// Declare app level module which depends on filters, and services
angular.module('brandscopicApp', [
  'ngRoute',
  'brandscopicApp.filters',
  'brandscopicApp.services',
  'brandscopicApp.directives',
  'brandscopicApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/navigationbar', {templateUrl: 'partials/navigationbar.html', controller: 'NavigationController'});
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
  $routeProvider.when('/forgotpassword', {templateUrl: 'partials/forgotpassword.html', controller: 'LoginController'});
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'DashboardController'});
  $routeProvider.when('/password', {templateUrl: 'partials/password.html', controller: 'PasswordController'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
