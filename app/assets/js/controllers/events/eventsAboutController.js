function EventsAboutController($scope, $window, $state, $stateParams, $sce, snapRemote, UserService, CompanyService, UserInterface, Event) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()
    var
        makeAlert = function(event) {
                          var
                              today = (new Date().getMonth() + 1) + "/" + new Date().getDate() + "/" + new Date().getFullYear()
                            , alert = {message: '', style: '', show: false}

                              // If the event happens in the future (but not today):
                              if (event.start_date > today) {
                                alert = { message: $sce.trustAsHtml('Your event is scheduled. You can manage the event team, complete tasks, upload event documents.'),
                                          style: 'box-container scheduled', /* should be grey */
                                          show : true }
                              }

                              // If the event have late tasks
                              if (event.tasks_late_count > 0) {
                                alert = { message: $sce.trustAsHtml('Your event has ' + event.tasks_late_count + ' late tasks. Click here to complete.'),
                                          style: 'box-container late', /* should be red */
                                          show : true }
                              }

                              // If the event have tasks that are due today:
                              if (event.tasks_due_today_count > 0) {
                                alert = { message: $sce.trustAsHtml('Your event has ' + event.tasks_due_today_count + ' tasks that are due today. Click here to complete.'),
                                          style: 'box-container scheduled', /* should be grey */
                                          show : true }
                              }

                              // If the event happens today and not submitted:
                              // if (event.start_date == today && event.event_status == 'Due') {
                              if (event.event_status == 'Due') {
                                var links = ' Please '
                                for(var i = 0, item; item = event.actions[i++];) {
                                  if (item == 'enter post event data') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/data\'>enter post event data</a>, '
                                  }
                                  if (item == 'upload photos') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/photos\'>upload photos</a>, '
                                  }
                                  if (item == 'conduct surveys') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/surveys\'>conduct surveys</a>, '
                                  }
                                  if (item == 'enter expenses') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/expenses\'>enter expenses</a>, '
                                  }
                                  if (item == 'gather comments') {
                                    links = links + ' and <a href=\'#/home/events/' + event.id + '/comments\'>gather comments</a>'
                                  }
                                }
                                links = links + ' from your audience during or shortly after the event. Once complete please submit your post event form.'
                                alert = { message: $sce.trustAsHtml('Your post event report is due.' + links),
                                          style: 'box-container due', /* should be grey */
                                          show : true }
                              }

                              // If the event is late:
                              if (event.event_status == 'Late') {
                                var links = ' Please '
                                for(var i = 0, item; item = event.actions[i++];) {
                                  if (item == 'enter post event data') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/data\'>enter post event data</a>, '
                                  }
                                  if (item == 'upload photos') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/photos\'>upload photos</a>, '
                                  }
                                  if (item == 'conduct surveys') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/surveys\'>conduct surveys</a>, '
                                  }
                                  if (item == 'enter expenses') {
                                    links = links + '<a href=\'#/home/events/' + event.id + '/expenses\'>enter expenses</a>, '
                                  }
                                  if (item == 'gather comments') {
                                    links = links + ' and <a href=\'#/home/events/' + event.id + '/comments\'>gather comments now</a>'
                                  }
                                }
                                links = links + ' from your audience during or shortly after the event. Once complete please submit your post event form.'
                                alert = { message: $sce.trustAsHtml('Your post event report is late.' + links),
                                          style: 'box-container late', /* should be grey */
                                          show : true }
                              }
                              // If the event is approved
                              if (event.event_status == 'Approved') {
                                alert = { message: $sce.trustAsHtml('Your post event report has been approved.'),
                                          style: 'box-container approved', /* should be green */
                                          show : true }
                              }

                              // If the event is rejected
                              if (event.event_status == 'Rejected') {
                                alert = { message: $sce.trustAsHtml('Your post event report form has been rejected for the following reasons: Rejection reason here. Please make the necessary changes and resubmit.'),
                                          style: 'box-container rejected', /* should be green */
                                          show : true }
                              }

                              // If the event is submitted
                              if (event.event_status == 'Submitted') {
                                alert = { message: $sce.trustAsHtml('Your post event report has been submitted for approval. Please review and either approve or reject.'),
                                          style: 'box-container submitted', /* should be green */
                                          show : true }
                              }
                              return alert
        }
      , ui = {hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "about"}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event
                                    $scope.alert = makeAlert(event)

                                    // Options for User Interface in home partial
                                    ui.title = event.campaign ? event.campaign.name : "Event"
                                    $scope.UserInterface = UserInterface
                                    $scope.eventId = $stateParams.eventId
                                    $scope.editUrl = "#home/events/" + $stateParams.eventId + "/edit"
                                    angular.extend(UserInterface, ui)
                              }
       }

    Event.find(credentials, actions)

    $scope.map_styles = [
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

    $scope.deleteEvent = function() {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
        , actions = { success: function (event) {
                            $scope.event = event
                            $state.go('home.events')
                      }
                    , error: function (event_error) {
                        $scope.event_error = event_error
                         console.log(event_error)
                      }
                    }

      $scope.event.active = false
      $scope.goBack = function(){
        $state.go('home.events')
        return
      }
      Event.update(credentials, actions, $scope.event)
    }
  }

EventsAboutController.$inject = [  '$scope'
                                 , '$window'
                                 , '$state'
                                 , '$stateParams'
                                 , '$sce'
                                 , 'snapRemote'
                                 , 'UserService'
                                 , 'CompanyService'
                                 , 'UserInterface'
                                 , 'Event'
                                ]

