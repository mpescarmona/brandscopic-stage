/**
 * Debounce service to limit API calls, especially around search fields
 */
angular.module('brandscopicApp.venueService', []).
    factory('venueService', ['$q', 'CompanyService', 'UserService', 'Venue', function ($q, CompanyService, UserService, Venue) {
        'use strict';

        var searchResult = []
        /*
         * Get the a list of venues by a search
         */
        var _getVenuesSearch = function (value) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, term: value }
            , actions = {
                success: function (items) {
                                defer.resolve(items)
                          }
                 , error: function (venue_error) {
                            scope.venue_error = venue_error
                            defer.reject()
                    }
                }

            Venue.search(credentials, actions)
            return defer.promise;
        }

        /*
         * Get venues for typeahead 
         */
        var _getVenuesAutocomplete = function (value) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, q: value }
            , actions = {
                success: function (items) {
                                searchResult = [];
                                angular.forEach(items, function (item) {
                                    angular.forEach(item.value, function (subItem) {
                                            searchResult.push({ category: item.label, label: subItem.label, value: subItem.value, type: subItem.type });
                                        });
                                    });
                                defer.resolve(searchResult)
                          }
                 , error: function (venue_error) {
                            scope.venue_error = venue_error
                            defer.reject()
                    }
                }

            Venue.venuesAutocomplete(credentials, actions)
            return defer.promise;
        }

        /*
         * Get the a list of venues by a params. 
         * If any param is not set brings all venues
         */
        var _getVenuesByFilters = function (campaign, place, user, brand, page) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'campaign[]': campaign, 'place[]': place, 'user[]': user, 'brand[]': brand, page: page }
            , actions = {
                success: function (items) {
                            defer.resolve(items)
                          }
                 , error: function (event_error) {
                            scope.event_error = event_error
                            defer.reject()
                    }
                }

            Venue.filterVenues(credentials, actions)
            return defer.promise;
        }

      return {
        getVenuesSearch: _getVenuesSearch,
        getVenuesAutocomplete: _getVenuesAutocomplete,
        getVenuesByFilters: _getVenuesByFilters
      }
}]);
