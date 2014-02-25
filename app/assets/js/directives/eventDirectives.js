angular.module('brandscopicApp.eventDirectives', [])
    .directive('scopicEventFilter', ['$q', 'CompanyService', 'debounce', 'UserService', 'Venue', 'Event', 'eventService', 'UserInterface', function ($q, CompanyService, debounce, UserService, Venue, Event, eventService, UserInterface) {
        "use strict";

        var link = function (scope, element, attrs) {
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
