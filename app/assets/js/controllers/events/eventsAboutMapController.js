function EventsAboutMapController($scope, $window, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: false, hasCustomHomeClass: false, searching: false, eventSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign.name
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    $scope.editUrl = "#home/events/" + $stateParams.eventId + "/edit"
                                    angular.extend(UserInterface, ui)
                              }
       }

    Event.find(credentials, actions)

    $scope.map_styles     =  [
                {
                        stylers: [
                                { hue: "#00ffe6" },
                                { saturation: -100 },
                                { gamma: 0.8 }
                        ]
                },{
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [
                                { lightness: 100 },
                                { visibility: "simplified" }
                        ]
                },{
                        featureType: "road",
                        elementType: "labels",
                        stylers: [
                                { visibility: "off" }
                        ]
                },{
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [
                                { color: "#BABABA" }
                        ]
                }
        ]
}

EventsAboutMapController.$inject = [  '$scope'
                                    , '$window'
                                    , '$state'
                                    , '$stateParams'
                                    , 'snapRemote'
                                    , 'UserService'
                                    , 'CompanyService'
                                    , 'UserInterface'
                                    , 'Event'
                                   ]

