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
  'brandscopicApp.controllers',
  'brandscopicApp.animations',
  'brandscopicApp.debounce',
  'brandscopicApp.sharedDirectives',
  'brandscopicApp.eventDirectives',
  'brandscopicApp.eventService',
  'brandscopicApp.photosService',
  'brandscopicApp.surveysService',
  'ui.bootstrap',
  'ngMap',
  'model.photos',
  'persistence.photos',
  'model.surveys',
  'persistence.surveys'
])
.config(function($stateProvider, $urlRouterProvider) {
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
      templateUrl: "views/home.html",
      controller: "homeCtrl"
    })
    .state('home.companies', {
      url: "/companies",
      views:{'details@home':{ templateUrl: "partials/companies.html",
                              controller: 'CompaniesController'
                            }
            }
    })
    .state('home.companies.select', {
      url: "/select",
      views:{'details@home':{ templateUrl: "partials/companies_select.html",
                              controller: 'CompaniesController'
                            }
            }
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
      views:{'details@home':{ templateUrl: "views/events/events.html",
                              controller: 'eventsCtrl'
                            }
            }
    })
    .state('home.events.add', {
      url: "/add",
      views:{'details@home':{ templateUrl: "views/events/events_add.html",
                              controller: 'eventsAddCtrl'
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
    .state('home.events.details.edit', {
      url: "/edit",
      views:{'details@home':{ templateUrl: "partials/events_edit.html",
                              controller: 'EventsEditController'
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
    .state('home.events.details.map', {
      url: "/map",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_about_map.html",
                              controller: 'EventsAboutMapController'
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
      abstract: true
    })
    .state('home.events.details.people.contacts.view', {
      url: "/:contactId/view",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts.html",
                              controller: 'EventsPeopleContactsController'
                            }
            }
    })
    .state('home.events.details.people.contacts.add', {
      url: "/add",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts_add.html",
                              controller: 'EventsPeopleContactsAddController'
                            }
            }
    })
    .state('home.events.details.people.contacts.edit', {
      url: "/:contactId/edit",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts_edit.html",
                              controller: 'EventsPeopleContactsEditController'
                            }
            }
    })
    .state('home.events.details.people.contacts.new', {
      url: "/new",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_contacts_new.html",
                              controller: 'EventsPeopleContactsNewController'
                            }
            }
    })
    .state('home.events.details.people.team', {
      url: "/team",
      abstract: true
    })
    .state('home.events.details.people.team.add', {
      url: "/add",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_people_team_add.html",
                              controller: 'EventsPeopleTeamAddController'
                            }
            }
    })
    .state('home.events.details.data', {
      url: "/data",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_data.html",
                              controller: 'EventsDataController'
                            }
            }
    })
    .state('home.events.details.data.view', {
      url: "/view",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_data_view.html",
                              controller: 'EventsDataViewController'
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
    .state('home.events.details.comments.add', {
      url: "/add",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_comments_add.html",
                              controller: 'EventsCommentsAddController'
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
    .state('home.events.details.tasks.details', {
      url: "/:taskId/details",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_tasks_details.html",
                              controller: 'EventsTasksDetailsController'
                            }
            }
    })
    .state('home.events.details.tasks.details.edit', {
      url: "/edit",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_tasks_details_edit.html",
                              controller: 'EventsTasksEditController'
                            }
            }
    })
    .state('home.events.details.photos', {
      url: "/photos",
      views:{'eventsDetail@home.events.details':{ templateUrl: "views/events/events_details_photos.html",
                              controller: 'eventsPhotosCtrl'
                            }
            }
    })
    .state('home.events.details.photos.slider', {
      url: "/slider/{index:.*}",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_photos_slider.html",
                              controller: 'EventsPhotoSliderController'
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
    .state('home.events.details.expenses.add', {
      url: "/add",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_expenses_add.html",
                              controller: 'EventsExpensesAddController'
                            }
            }
    })
    .state('home.events.details.expenses.photo', {
      url: "/:expenseId/photo",
      views:{'eventsDetail@home.events.details':{ templateUrl: "partials/events_details_expenses_photo.html",
                              controller: 'EventsExpensesPhotoController'
                            }
            }
    })
    .state('home.events.details.surveys', {
      url: "/surveys",
      views:{'eventsDetail@home.events.details':{ templateUrl: "views/surveys/events_details_surveys.html",
                              controller: 'eventsSurveysController'
                            }
            }
    })
    .state('home.events.details.surveys.add', {
      url: "/add",
      views:{'eventsDetail@home.events.details':{ templateUrl: "views/surveys/events_details_surveys_add.html",
                              controller: 'eventsSurveysAddController'
                            }
            }
    })
    .state('home.tasks', {
      url: "/tasks",
      views:{'details@home':{ templateUrl: "partials/tasks.html",
                              controller: 'TasksController'
                            }
            }
    })

    .state('home.venues', {
      url: "/venues",
      views:{'details@home':{ templateUrl: "partials/venues.html",
                              controller: 'VenuesController'
                            }
            }
    })
    .state('home.venues.add', {
      url: "/add",
      views:{'details@home':{ templateUrl: "partials/venues_add.html",
                              controller: 'VenuesAddController'
                            }
            }
    })
    .state('home.venues.details', {
      url: "/:venueId",
      views:{'details@home':{ templateUrl: "partials/venues_details.html",
                              controller: 'VenuesDetailsController'
                            }
            }
    })
    .state('home.venues.details.about', {
      url: "/about",
      views:{'venuesDetail@home.venues.details':{ templateUrl: "partials/venues_details_about.html",
                              controller: 'VenuesAboutController'
                            }
            }
    })
    .state('home.venues.details.analysis', {
      url: "/analysis",
      views:{'venuesDetail@home.venues.details':{ templateUrl: "partials/venues_details_analysis.html",
                              controller: 'VenuesAnalysisController'
                            }
            }
    })
    .state('home.venues.details.photos', {
      url: "/photos",
      views:{'venuesDetail@home.venues.details':{ templateUrl: "partials/venues_details_photos.html",
                              controller: 'VenuesPhotosController'
                            }
            }
    })
    .state('home.venues.details.photos.slider', {
      url: "/slider",
      views:{'venuesDetail@home.venues.details':{ templateUrl: "partials/venues_details_photos_slider.html",
                              controller: 'VenuesPhotoSliderController'
                            }
            }
    })
    .state('home.venues.details.comments', {
      url: "/comments",
      views:{'venuesDetail@home.venues.details':{ templateUrl: "partials/venues_details_comments.html",
                              controller: 'VenuesCommentsController'
                            }
            }
    })
    .state('home.notifications', {
      url: "/notifications",
      views:{'details@home':{ templateUrl: "partials/notifications.html",
                              controller: 'NotificationsController'
                            }
            }
    })
    .state('home.profile', {
      url: "/profile",
      views:{'details@home':{ templateUrl: "partials/edit_profile.html",
                              controller: 'ProfileController'
                            }
            }
    })
})
//enables CORS in angular
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }
])
.run(["$rootScope", function ($rootScope) {
        $rootScope.alert = function (text) {
            alert(text);
        };
        /**
         * Use 'injectConst' which provides a place to inject relevant bits of the scopic
         * into all child controller $scopes by attaching as a reference
         * on the application's over-arching parent scope
         * so that they may be accessed by ALL child $scope objects.
         * We do this instead of just simply assigning adaptv_api
         * in order to suppress any lingering memory concerns.
         *
         * This makes scopic.consts directly accessible through the views for directives like ng-show and ng-disabled etc.
         * This also makes it transparent for developers to write custom component directives as well.
         */
        scopic.injectConst($rootScope);

}]);
