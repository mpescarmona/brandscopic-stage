angular.module('brandscopicApp.eventDirectives', [])
    .directive('scopicEventFilter', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', 'UserInterface', '$window', '$state', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService, UserInterface, $window, $state) {
        "use strict";

        var link = function (scope, element, attrs) {
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

          scope.handleEventClick = function(permission, state, eventId) {
            if (UserService.permissionIsValid(permission)) {
              $state.go(state, {eventId: eventId});
              //$window.location.href = path;
            }
          };

          scope.permissionIsValid = function(permission) {
            return UserService.permissionIsValid(permission);
          };

            scope.$watch("filter", function (value) {
              console.log(value);
                var campaign = [], place = [], user = [], brand = [], brand_portfolio = [], venue = []; 
                if(value !== "" || value !== undefined) {
                    switch(value.type) {
                      case scopic.consts.events_typeahead_categories.CAMPAIGN:
                          campaign.push(value.id);
                          break;
                      case scopic.consts.events_typeahead_categories.BRAND:
                          brand.push(value.id);
                          break;
                      case scopic.consts.events_typeahead_categories.BRAND2:
                          brand_portfolio.push(value.id);
                          break;
                      case scopic.consts.events_typeahead_categories.PLACE:
                          place.push(value.id);
                          break;
                      case scopic.consts.events_typeahead_categories.USER:
                          user.push(value.id);
                          break;
                      case scopic.consts.events_typeahead_categories.VENUE:
                          venue.push(value.id);
                          break;
                    }

                    eventService.getEventsByFilters(campaign, place, user, brand, brand_portfolio, venue).then( function (response) {
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
