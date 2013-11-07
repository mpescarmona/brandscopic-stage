'use strict';

/* Controllers */

angular.module('brandscopicApp.controllers', [])
  .controller('LoginController', ['$scope', function($scope) {
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
          if (sameEmail && samePasswd) console.log('pepe'); return 
        }   
    };
  }])
  .controller('NavigationController', ['$scope', function($scope) {
    $scope.navigationItems = [{'label': 'EVENTS', 'link': '#'},
                              {'label': 'TASKS',  'link': '#'},
                              {'label': 'VENUES', 'link': '#'},
                              {'label': 'NOTIFICATIONS', 'link': '#'},
                              {'label': 'DASHBOARD', 'link': 'dashboard'},
                              {'label': 'EDIT PROFILE', 'link': '#'},
                              {'label': 'LOGOUT', 'link': 'login'}];
  }])
  .controller('DashboardController', ['$scope', function($scope) {

  }])
  .controller('EventsController', ['$scope', function($scope) {

  }])
  .controller('PasswordController', ['$scope', function($scope) {

  }]);