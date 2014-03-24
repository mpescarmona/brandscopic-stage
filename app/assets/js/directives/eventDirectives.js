angular.module('brandscopicApp.eventDirectives', [])
    .directive('scopicEventFilter', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', 'UserInterface', '$window', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService, UserInterface, $window) {
        "use strict";

        var link = function (scope, element, attrs) {
          console.log('EventsFilterDirective executed');
          scope.getEventBorderColor = function (event_status) {
              var classSelected;
              switch(event_status) {
                case scopic.consts.event_status.APPROVED:
                  classSelected = 'approve';
                  break;
                case scopic.consts.event_status.LATE:
                  classSelected = 'late';
                  break;
                case scopic.consts.event_status.DUE:
                  classSelected = 'due';
                  break;
                case scopic.consts.event_status.SUBMITTED:
                  classSelected = 'submitted';
                  break;
                case scopic.consts.event_status.REJECTED:
                  classSelected = 'late';
                  break;
              }
              return classSelected;
          };

          scope.getLastOfDateButtonClass = function (event) {
            return event.start_date_LAST_OF_GROUP ? "last_of_group" : "";
          };

          scope.handleEventClick = function(permission, path) {
            if (UserService.permissionIsValid(permission)) {
              $window.location.href = path;
            }
          };

          scope.permissionIsValid = function(permission) {
            return UserService.permissionIsValid(permission);
          };

          scope.$watch("filter", function (value) {
              var campaign = [], place = [], user = [], brand = [];
              if(value !== "" || value !== undefined) {
                  switch(value.type) {
                    case scopic.consts.events_typeahead_categories.CAMPAIGNS:
                        campaign.push(value.id);
                        break;
                    case scopic.consts.events_typeahead_categories.BRANDS:
                        brand.push(value.id);
                        break;
                    case scopic.consts.events_typeahead_categories.PLACES:
                        place.push(value.id);
                        break;
                    case scopic.consts.events_typeahead_categories.USERS:
                        user.push(value.id);
                        break;
                  }

                  eventService.getEventsByFilters(campaign, place, user, brand).then( function (response) {
                      scope.eventsItems = response.results;
                  });
              }
          })
        };

        return {
            link: link,
            scope: {
              filter: "=",
              eventsItems: "="
            },
            restrict: 'E',
            templateUrl: 'views/directives/templates/eventFilter.html'
        };

    }]);
