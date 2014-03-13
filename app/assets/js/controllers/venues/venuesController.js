function VenuesController ($scope, $state, snapRemote, UserService, CompanyService, venueService, UserInterface, Venue) {
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

    $scope.$on("RESULT_SEARCH", function (event, filter) {
        var location = "", campaign = [], page = 1;
        //TODO. filter should bring the location and campaign id, but only bring us "value, label and id"
        //      for that I can not pass the param to do the filter and refresh the venue list with the search result.
        if(filter && filter !== "" || filter !== undefined) {
            if(filter.type == "location") {
               location = filter.id;
            }
            if(filter.type == "campaign") {
               campaign.push(filter.id);
            }

          // I hardcode a filter param in order to see the refresh list with the result of the campaign 60.
          // The method is working well. but I don't know where I should get the filters
          campaign.push(60);

          /*
            location: should be string.
            campaign: should be array with id of the campaing.
            page: should be enteger.
          */
          venueService.getVenuesByFilters(location, campaign, page).then( function (response) {
              $scope.venuesItems = response.results;
          });
        }
    });
}

VenuesController.$inject = [  '$scope'
                            , '$state'
                            , 'snapRemote'
                            , 'UserService'
                            , 'CompanyService'
                            , 'venueService'
                            , 'UserInterface'
                            , 'Venue'
                           ]
