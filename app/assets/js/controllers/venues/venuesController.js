var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, snapRemote, UserService, CompanyService, venueService, UserInterface, Venue) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.showVenues = false
    var
        ui = {title: 'Venues', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: true, hasAddIcon: true, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, AddIconState: "home.venues.add"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , options = { force: true }
      , actions = { success: function(venues) {
                                $scope.venuesItems = venues
                                if($scope.venuesItems.length) {
                                  $scope.showVenues = true
                                }
                                $scope.page = venues.page
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }

    Venue.all(credentials, actions, options)

    // Set typeahead to search by venues
    $scope.$emit("SEARCH_DIRECTIVE", "venues")

    // This listener is waiting for the item selected in the search result in order to refresh the venues list.
    $scope.$on("RESULT_SEARCH", function (event, filter) {
        var campaign = [], place = [], user = [], brand = []
     
          switch(filter.type) {
            case "campaign":
                campaign.push(filter.id)
                break
            case "brand":
                brand.push(filter.id)
                break
            case "place":
                place.push(filter.id)
                break
            case "user":
                user.push(filter.id)
                break
          }

          venueService.getVenuesByFilters(campaign, place, user, brand).then( function (response) {
              $scope.venuesItems = response.results
          })
    })

    $scope.$on("CLOSE_SEARCH", function (value) {
      if(value) {
          venueService.getVenuesByFilters().then( function (response) {
              $scope.venuesItems = response.results
          })
      }
    })
}

module.controller('VenuesController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'venueService'
                                           , 'UserInterface'
                                           , 'Venue'
                                          ]
