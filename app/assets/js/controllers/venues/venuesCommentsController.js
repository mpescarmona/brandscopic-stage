function VenuesCommentsController($scope, $state, $stateParams, snapRemote, CompanyService, UserService, UserInterface, Venue) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()
    $scope.showComments = false

    var
        ui = {}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
      , actions = { success: function(venue) {
                                ui = {title: venue.name, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, showVenueSubNav: true, hasCustomHomeClass: false, searching: false, venueSubNav: "comments"}
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface

                                var
                                    credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, venue_id: $stateParams.venueId }
                                  , actions = { success: function(comments) {
                                                            if (comments.length)
                                                                  $scope.showComments = true

                                                            $scope.comments = []
                                                            for(var i = 0, item; item = comments[i++];) {
                                                              if (item.type == 'brandscopic')
                                                                $scope.comments.push( { id: item.id,
                                                                                       content: item.content,
                                                                                       time: item.created_at,
                                                                                       author: undefined,
                                                                                       rating: undefined,
                                                                                       type: 'brandscopic'
                                                                                     } )
                                                              else
                                                                $scope.comments.push( { id: undefined,
                                                                                       content: item.text,
                                                                                       time: item.time,
                                                                                       author: item.author_name,
                                                                                       rating: item.rating,
                                                                                       type: 'google'
                                                                                     } )
                                                            }
                                              }
                                    }
                                Venue.comments(credentials, actions)
                              }
        }

    Venue.find(credentials, actions)
  }
VenuesCommentsController.$inject = [  '$scope'
                                    , '$state'
                                    , '$stateParams'
                                    , 'snapRemote'
                                    , 'CompanyService'
                                    , 'UserService'
                                    , 'UserInterface'
                                    , 'Venue'
                                   ]
