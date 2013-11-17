'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', [])
  .controller('LoginController', ['$scope', '$state', 'UserService', function($scope, $state, UserService) {
    $scope.user = {'email': '', 'password': ''};

    $scope.users = [{'email': 'testuser@brandscopic.com', 'password': 'testuser'},
                    {'email': 'testuser1@brandscopic.com', 'password': 'testuser1'}];

    $scope.wrongUser = null;
    $scope.validateUser = function() {
      $scope.wrongUser = true;
      UserService.currentUser.isLogged = false;
      UserService.currentUser.email = "";
        for (var i = 0, u, sameEmail, samePasswd; u = $scope.users[i++];) {
          sameEmail = u.email.toLowerCase() == $scope.user.email.toLowerCase();
          samePasswd = u.password == $scope.user.password;
          console.log(sameEmail)
          if (sameEmail && samePasswd) {
            $scope.wrongUser = false;
            UserService.currentUser.isLogged = true;
            UserService.currentUser.email = u.email.toLowerCase();
            $state.go('home');
            return;
          }
        }   
    };
  }])
  .controller('HomeController', ['$scope', '$state', 'snapRemote', 'UserService',  function($scope, $state, snapRemote, UserService) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }

    $scope.logout = function() {
      UserService.currentUser.isLogged = false;
      UserService.currentUser.email = "";
      $state.go('login');
      return;
    };

    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#'},
                              {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#'},
                              {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#home/dashboard'}];

    $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#', 'click': ''},
                          {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '#', 'click': 'logout()'}];
  }])
  .controller('DashboardController', ['$scope', '$state', 'snapRemote', 'UserService',  function($scope, $state, snapRemote, UserService) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close();

    $scope.dashboardItems = [{'id': 1, 'name': 'Gin BAs FY14', 'today': '30%', 'progress': '40%'},
                             {'id': 2, 'name': 'Jameson Locals FY14', 'today': '65%', 'progress': '10%'},
                             {'id': 3, 'name': 'Jameson CE FY13', 'today': '75%', 'progress': '60%'},
                             {'id': 4, 'name': 'Gin BAs FY14', 'today': '45%', 'progress': '80%'},
                             {'id': 5, 'name': 'Mama Walker\'s FY14', 'today': '65%', 'progress': '30%'},
                             {'id': 6, 'name': 'Royal Salute FY14', 'today': '25%', 'progress': '30%'}];
  }])
  .controller('EventsController', ['$scope', '$state', 'snapRemote', 'UserService',  function($scope, $state, snapRemote, UserService) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()
  }])
  .controller('PasswordController', ['$scope', function($scope) {
  }]);
  