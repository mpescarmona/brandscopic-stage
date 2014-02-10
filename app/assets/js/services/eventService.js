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
                credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
              , actions = { 
                  success: function (items) {
                                  searchResult = [];
                                  angular.forEach(items.facets, function (item) {
                                      angular.forEach(item.items, function (subItem) {
                                              searchResult.push({ category: subItem.name, label: subItem.label, id: subItem.id });
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