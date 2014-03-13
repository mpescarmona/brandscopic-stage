function DashboardDetailsController($scope, $state, $stateParams, snapRemote, UserService, CompanyService, UserInterface, Campaign) {
    if( !UserService.isLogged() ) {
      $state.go('login')
      return
    }
    snapRemote.close()

    $scope.campaignName = ''
    $scope.getCampaignName = function(campaignId) {
      var
          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token }
        , actions = { success: function(stats) {
                                  // $scope.dashboardItems = stats
                                  if(stats.length) {
                                    for (var i = 0, stat; stat = stats[i++];) {
                                      if (stat.id == campaignId) {
                                        $scope.campaignName = stat.name
                                      } 
                                    }
                                  }
                                }
          }
      Campaign.stats(credentials, actions)
    }

    $scope.getCampaignName($stateParams.dashboardId)
    $scope.showDashboardDetails = false
    var
        ui = {title: $scope.campaignName, hasMenuIcon: false, hasDeleteIcon: false, hasBackIcon: true, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: false, hasCancelIcon: false, hasCloseIcon: false, hasCustomHomeClass: false, searching: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, campaign_id: $stateParams.dashboardId }
      , actions = { success: function(statDetails) {
                                $scope.dashboardDetailItems = statDetails
                                if($scope.dashboardDetailItems.length) {
                                  $scope.showDashboardDetails = true
                                }
                                angular.extend(UserInterface, ui)
                                $scope.UserInterface = UserInterface
                              }
        }

    Campaign.statDetails(credentials, actions)
  }

DashboardDetailsController.$inject = [  '$scope'
                                      , '$state'
                                      , '$stateParams'
                                      , 'snapRemote'
                                      , 'UserService'
                                      , 'CompanyService'
                                      , 'UserInterface'
                                      , 'Campaign'
                                     ]
