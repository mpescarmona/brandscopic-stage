'use strict';


// Declare app level module which depends on filters, and services
angular.module('brandscopicApp', [
  'ui.router',
  'snap',
  'angular-flip',
  'ngResource',
  'brandscopicApp.filters',
  'brandscopicApp.services',
  'brandscopicApp.directives',
  'brandscopicApp.controllers'
]).
config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /login
  $urlRouterProvider.otherwise("/login");
  //
  // Now set up the states
  $stateProvider
    .state('login', {
      url: "/login",
      templateUrl: "partials/login.html",
      controller: "LoginController"
    })
    .state('home', {
      url: "/home",
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .state('home.dashboard', {
      url: "/dashboard",
      templateUrl: "partials/dashboard.html",
      controller: 'DashboardController'
    })
    .state('home.dashboard.details', {
      url: "/:dashboardId",
      templateUrl: "partials/dashboard_details.html",
      controller: 'DashboardController'
    })
    .state('home.events', {
      url: "/events",
      templateUrl: "partials/events.html",
      controller: 'EventsController'
    })
    .state('home.events.details', {
      url: "/:eventId",
      templateUrl: "partials/events_details.html",
      controller: 'EventsController'
    })
});
