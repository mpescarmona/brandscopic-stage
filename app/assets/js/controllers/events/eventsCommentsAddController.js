var module = angular.module('brandscopicApp.controllers')
  , controller = function ($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Comment) {

      if( !UserService.isLogged() ) {
        $state.go('login')
        return
      }
      snapRemote.close()

      var
          ui = {title: "Comment", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "comments", AddIconState: ""}
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event) {
                                      $scope.event = event
                                      $scope.eventId = $stateParams.eventId
                                      // Options for User Interface in home partial
                                      angular.extend(UserInterface, ui)
                                      $scope.UserInterface = UserInterface
                                      $scope.createComment = function() {
                                        var
                                            credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                          , actions = { success: function (comment) {
                                                              $scope.comment = comment
                                                              $location.path("/home/events/" + event.id + "/comments")
                                                        }
                                                      , error: function (comment_error) {
                                                          $scope.comment_error = comment_error
                                                           console.log(comment_error)
                                                        }
                                                      }
                                        Comment.create(credentials, actions, $scope.comment)
                                      }
                               }
          }
      Event.find(credentials, actions)
}

module.controller('EventsCommentsAddController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Comment'
                                          ]
