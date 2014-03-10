function DashboardController($scope, $state, snapRemote, UserService, CompanyService, UserInterface, Campaign) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()


    $scope.showDashboard = false
    var
        ui = {title: 'Dashboard', hasMenuIcon: true, hasDeleteIcon: false, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
      , actions = { success: function(stats) {
                                $scope.dashboardItems = stats
                                if($scope.dashboardItems.length) {
                                  $scope.showDashboard = true
                                }
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }

    Campaign.stats(credentials, actions)
  }

DashboardController.$inject = [  '$scope'
                               , '$state'
                               , 'snapRemote'
                               , 'UserService'
                               , 'CompanyService'
                               , 'UserInterface'
                               , 'Campaign'
                              ]
