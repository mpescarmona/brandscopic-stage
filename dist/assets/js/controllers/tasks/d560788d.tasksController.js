var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, snapRemote, UserService, UserInterface) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    var
        ui = { title: 'Tasks', hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasEditSurveyIcon: false, hasCancelIcon: false, hasCustomHomeClass: false, searching: false}

    // Options for User Interface in home partial
    angular.extend(UserInterface, ui);
    $scope.UserInterface = UserInterface;
  }

module.controller('TasksController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'UserInterface'
                                          ]
