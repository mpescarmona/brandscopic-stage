var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, Notification, snapRemote, UserService, CompanyService, $state, UserInterface, allowedNotificationsFilter) {
    //This function is used in order to save the scope of the id parameter.
    function actionCreator(destinationState, parameters) {
      return function() {
        if (destinationState) {
          $state.go(destinationState, parameters);
        }
      };
    }
    snapRemote.close();

    var ui = { title: 'Notifications', hasMenuIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false, hasBackIcon: false}
    angular.extend(UserInterface, ui);

    var credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, 'status[]': 'Active' };
    var actions = {
      success: function(notifications) {
        var viewModel = [];        
        notifications = allowedNotificationsFilter(notifications);

        for (var i = 0; i < notifications.length; i++) {
          var notification = notifications[i];
          var destinationState = null;
          var parameters = {};
          if (notification.event_id) {
            parameters = { eventId: notification.event_id };
            destinationState = 'home.events.details.about';
          } else if (notification.type === 'event_recaps_due') {
            parameters = { filter: 'due' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_late') {
            parameters = { filter: 'late' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_pending') {
            parameters = { filter: 'pending' };
            destinationState = 'home.events';
          } else if (notification.type === 'event_recaps_rejected') {
            parameters = { filter: 'rejected' };
            destinationState = 'home.events';
          }
          //TODO: Redirect to a task once we have a tasks endpoint.

          var colorClass = Notification.getNotificationClass(notification);
          viewModel.push({
              message: notification.message,
              level: notification.level,
              type: notification.type.indexOf('task') != -1 ? 'tasks' 
                    : notification.type.indexOf('event') != -1 ? 'event' : '',
              action: actionCreator(destinationState, parameters),
              colorClass: colorClass
            });
        }
        $scope.notifications = viewModel;
      }
    }
    Notification.all(credentials, actions)
  }

module.controller('NotificationsController'
                  , controller).$inject = [  '$scope'
                                           , 'Notification'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , '$state'
                                           , 'UserInterface'
                                           , 'allowedNotificationsFilter'
                                          ]
