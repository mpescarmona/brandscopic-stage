'use strict';


// Declare app level module which depends on filters, and services
angular.module('brandscopicApp', [
  'ui.router',
  'snap',
  'angular-flip',
  'ngResource',
  'ngTouch',
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
      views:{'details@home':{ templateUrl: "partials/dashboard.html",
                              controller: 'DashboardController'
                            }
            }
    })
    .state('home.dashboard.details', {
      url: "/:dashboardId",
      views:{'details@home':{ templateUrl:"partials/dashboard_details.html",
                              controller: 'DashboardController'
                            }
            }
    })
    .state('home.events', {
      url: "/events",
      views:{'details@home':{ templateUrl: "partials/events.html",
                              controller: 'EventsController'
                            }
            }
    })
    .state('home.events.details', {
      url: "/:eventId",
      views:{'details@home':{ templateUrl: "partials/events_details.html",
                              controller: 'EventsDetailsController'
                            }
            }
    })
    .state('home.events.details.people', {
      url: "/people",
      views:{'details@home':{ templateUrl: "partials/events_details_people.html",
                              controller: 'EventsDetailsController'
                            }
            }
    })
});
