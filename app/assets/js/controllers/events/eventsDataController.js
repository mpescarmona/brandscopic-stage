var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event) {

    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    var
        ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasEditIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasCloseIcon: false, showEventSubNav: true, eventSubNav: "data", hasAddPhoto: false}

        , authToken = UserService.currentUser.auth_token
        , companyId = CompanyService.getCompanyId()
        , eventId = $stateParams.eventId
        , eventResultsData = []
        , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function(event) {
                                      $scope.event = event
                                      var edit = ($stateParams.edit) ? $stateParams.edit : false
                                      if ($scope.event.have_data == true && !edit)
                                        $location.path("/home/events/" + event.id + "/data/view")

                                      // Options for User Interface in home partial
                                      ui.title = event.campaign ? event.campaign.name : "Data"
                                      angular.extend(UserInterface, ui)
                                      $scope.UserInterface = UserInterface

                                      var
                                          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                        , actions = { success: function(results) {
                                                                  $scope.eventResultsItems = results
                                                               }
                                        }
                                      Event.results(credentials, actions)
                      }
          }
     Event.find(credentials, actions)

      $scope.updateEventData = function(results) {
        var
            credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
          , actions = { success: function (event) {
                              $scope.event = event
                              $location.path("/home/events/" + event.id + "/data/view")
                        }
                      , error: function (event_error) {
                          $scope.event_error = event_error
                           console.log(event_error)
                        }
                      }
          , results_attributes = []

        for(var i = 0, result; result = results[i++];) {
          for(var j = 0, field; field = result.fields[j++];) {
            if (field.field_type == 'percentage') {
              for(var k = 0, segment; segment = field.segments[k++];) {
                if (segment.value !== null)
                  results_attributes.push({'id': segment.id, 'value': segment.value})
              }
            }
            if (field.field_type == 'number') {
              if (field.value !== null)
                results_attributes.push({'id': field.id, 'value': field.value})
            }
            if (field.field_type == 'text') {
              if (field.value !== null)
                results_attributes.push({'id': field.id, 'value': field.value})
            }
            if (field.field_type == 'count') {
              if (field.options.capture_mechanism == "checkbox") {
                var segmentIds = []
                for(var k = 0, segment; segment = field.segments[k++];) {
                  if (segment.value)
                    segmentIds.push(segment.id)
                }
                if (segmentIds.length > 0)
                  results_attributes.push({'id': field.id, 'value': segmentIds})
              } else {
                results_attributes.push({'id': field.id, 'value': field.value})
              }
            }
          }
        }

        var data = {
                      "event": {
                        "summary": $scope.event.summary,
                        "results_attributes": results_attributes
                      }
                   }
        Event.updateResults(credentials, actions, data)
      }

    $scope.isActive = false;
    $scope.isMore = false;
    $("#showMore").html("Show more text &#9660;");
    $scope.showMoreText = function () {
        $scope.isActive = !$scope.isActive;
        if($scope.isActive) {
          $scope.isMore = true;
          $("#showMore").html("Show less text &#9650;");
        } else {
          $("#showMore").html("Show more text &#9660;");
          $scope.isMore = false;
        }
    }
}

module.controller('EventsDataController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                          ]
