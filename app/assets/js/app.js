'use strict';


// Declare app level module which depends on filters, and services
angular.module('brandscopicApp', [
  'ui.router',
  'snap',
  'angular-flip',
  'ngResource',
  'ngAnimate',
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
    .state('home.events.details.about', {
      url: "/about",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_about.html",
                              controller: 'EventsAboutController'
                            }
            }
    })
    .state('home.events.details.about.map', {
      url: "/map",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_about_map.html",
                              controller: 'EventsAboutController'
                            }
            }
    })
    .state('home.events.details.people', {
      url: "/people",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people.html",
                              controller: 'EventsPeopleController'
                            }
            }
    })
    .state('home.events.details.people.contacts', {
      url: "/contacts",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts.html",
                              controller: 'EventsPeopleController'
                            }
            }
    })
    .state('home.events.details.people.contacts.edit', {
      url: "/:contactId/edit",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts_edit.html",
                              controller: 'EventsPeopleController'
                            }
            }
    })
    .state('home.events.details.people.team', {
      url: "/team",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_team.html",
                              controller: 'EventsPeopleController'
                            }
            }
    })
    .state('home.events.details.people.team.edit', {
      url: "/:teamId/edit",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_team_edit.html",
                              controller: 'EventsPeopleController'
                            }
            }
    })
    .state('home.events.details.data', {
      url: "/data",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_data.html",
                              controller: 'EventsDetailsController'
                            }
            }
    })
    .state('home.events.details.comments', {
      url: "/comments",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_comments.html",
                              controller: 'EventsCommentsController'
                            }
            }
    })
    .state('home.events.details.tasks', {
      url: "/tasks",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_tasks.html",
                              controller: 'EventsTasksController'
                            }
            }
    })    
    .state('home.events.details.photos', {
      url: "/photos",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_photos.html",
                              controller: 'EventsPhotosController'
                            }
            }
    })
    .state('home.events.details.expenses', {
      url: "/expenses",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_expenses.html",
                              controller: 'EventsExpensesController'
                            }
            }
    })                    
});
