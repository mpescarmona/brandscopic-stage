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
                                            searchResult.push({ category: item.label, label: subItem.label });
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

      return {
        getEventSearch: _getEventSearch
      }
}]);
