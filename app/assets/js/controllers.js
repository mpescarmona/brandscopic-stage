'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', [])
  .controller('LoginController', ['$scope', '$location', function($scope, $location) {
    $scope.validUser = false;
    $scope.user = {'email': '', 'password': ''};

    $scope.users = [{'email': 'testuser@brandscopic.com', 'password': 'testuser'},
                    {'email': 'testuser1@brandscopic.com', 'password': 'testuser1'}];

    $scope.validateUser = function() {
     $scope.validUser = false;
        for (var i = 0, u, sameEmail, samePasswd; u = $scope.users[i++];) {
          sameEmail = u.email.toLowerCase() == $scope.user.email.toLowerCase();
          samePasswd = u.password == $scope.user.password;
          console.log(sameEmail)
          if (sameEmail && samePasswd) {
           $scope.validUser = true;
            console.log($scope.validUser);
            $location.path('/navigation');
            return
          }
        }   
    };

  }])
  .controller('NavigationController', ['$scope', function($scope) {
    $scope.navigationItems = [{'class': 'eventIcon', 'label': 'EVENTS', 'link': '#'},
                              {'class': 'tasksIcon', 'label': 'TASKS',  'link': '#'},
                              {'class': 'venuesIcon', 'label': 'VENUES', 'link': '#'},
                              {'class': 'notificationIcon', 'label': 'NOTIFICATIONS', 'link': '#'},
                              {'class': 'dashboardIcon', 'label': 'DASHBOARD', 'link': '#/dashboard'}];

    $scope.actionItems = [{'class': 'profileIcon', 'label': 'EDIT PROFILE', 'link': '#'},
                          {'class': 'logoutIcon', 'label': 'LOGOUT', 'link': '#/login'}];
  }])
  .controller('DashboardController', ['$scope', function($scope) {

  }])
  .controller('EventsController', ['$scope', function($scope) {

  }])
  .controller('PasswordController', ['$scope', function($scope) {

  }]);