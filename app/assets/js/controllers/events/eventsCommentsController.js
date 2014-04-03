var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Event, Comment) {

  if( !UserService.isLogged() ) {
    $state.go('login')
    return
  }
  snapRemote.close()
  $scope.showComments = false
  $scope.loading = true

  var
      ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: true, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: "home.events.details.comments.add", hasAddPhoto: false}
    , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
    , actions = { success: function(event) {
                                  $scope.loading = false
                                  $scope.event = event
                                  $scope.eventId = $stateParams.eventId

                                  // Options for User Interface in home partial
                                  ui.title = event.campaign ? event.campaign.name : "Comments"
                                  ui.hasAddIcon = Event.can('gather comments')
                                  angular.extend(UserInterface, ui)
                                  $scope.UserInterface = UserInterface

                                  var
                                      credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                    , action = { success: function(comments) {
                                                                $scope.showComments = true
                                                                $scope.comments = comments
                                                           }
                                              }

                                  Comment.all(credentials, action)
                            }
     }
  Event.find(credentials, actions)
} 

module.controller('EventsCommentsController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Comment' 
                                          ]

