'use strict';


// Declare app level module which depends on filters, and services
angular.module('brandscopicApp', [
  'ngRoute',
  'snap',
  'angular-flip',
  'brandscopicApp.filters',
  'brandscopicApp.services',
  'brandscopicApp.directives',
  'brandscopicApp.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: 'LoginController'});
  $routeProvider.when('/navigation', {templateUrl: 'partials/navigation.html', controller: 'NavigationController'});
  $routeProvider.when('/dashboard', {templateUrl: 'partials/dashboard.html', controller: 'DashboardController'});
  $routeProvider.when('/events', {templateUrl: 'events.html', controller: 'EventsController'});
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
