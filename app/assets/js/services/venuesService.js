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
                                searchResult = [];
                                angular.forEach(items, function (item) {
                                        searchResult.push({ category: "", label: item.label, id: item.id });
                                    });
                                defer.resolve(searchResult)
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
         * Get the a list of venues by a params. 
         * If any param is not set brings all venues
         */
        var _getVenuesByFilters = function (location, campaign, page) {
            var defer = $q.defer();
            var
              credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, location: location, 'campaign[]': campaign, page: page }
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
        getVenuesByFilters: _getVenuesByFilters
      }
}]);
