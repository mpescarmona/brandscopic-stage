/**
 * Debounce service to limit API calls, especially around search fields
 */
angular.module('brandscopicApp.eventService', []).
    factory('eventService', ['$q', 'CompanyService', 'UserService', 'Event', function ($q, CompanyService, UserService, Event) {
        'use strict';

        var searchResult = []
        var _getEventSearch = function (value) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, q: value }
            , actions = {
                success: function (items) {
                                searchResult = [];
                                angular.forEach(items, function (item) {
                                    angular.forEach(item.value, function (subItem) {
                                            searchResult.push({ category: item.label, label: subItem.label, id: subItem.value });
                                        });
                                    });
                                defer.resolve(searchResult)
                          }
                 , error: function (event_error) {
                            scope.event_error = event_error
                            defer.reject()
                    }
                }

            Event.search(credentials, actions)
            return defer.promise;
        }

        var _getEventsByFilters = function (campaign, place, user, brand) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'campaign[]': campaign, 'place[]': place, 'user[]': user, 'brand[]': brand }
            , actions = {
                success: function (items) {
                            defer.resolve(items)
                          }
                 , error: function (event_error) {
                            scope.event_error = event_error
                            defer.reject()
                    }
                }

            Event.filterEvents(credentials, actions)
            return defer.promise;
        }

      return {
        getEventSearch: _getEventSearch,
        getEventsByFilters: _getEventsByFilters
      }
}]);
