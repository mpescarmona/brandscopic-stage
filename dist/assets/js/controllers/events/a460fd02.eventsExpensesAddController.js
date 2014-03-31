var module = angular.module('brandscopicApp.controllers')
  , controller = function($scope, $state, $stateParams, $location, snapRemote, UserService, CompanyService, UserInterface, Event, Expense) {

    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()
    $scope.event_expense = $scope.event_expense || {}

    var
        ui = {title: "Expense", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, hasCustomHomeClass: false, searching: false, eventSubNav: "expenses", AddIconState: "", hasAddPhoto: false}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.createExpense = function () {
                                        var
                                           credentials = { company_id: CompanyService.getCompanyId()
                                                           , auth_token: UserService.currentUser.auth_token
                                                           , event_id: $stateParams.eventId
                                           }
                                           , actions = { success: function (expense) {
                                                           $scope.event_expense = expense
                                                           $location.path("/home/events/" + event.id + "/expenses")
                                                         }
                                                         , error: function (expense_error) {
                                                             $scope.expense_error = expense_error
                                                             console.log(expense_error)
                                                           }
                                                       }

                                          Expense.create(credentials, actions,$scope.event_expense)

                                    }
                                    $scope.triggerExpense = function () {
                                      if ($scope.image)
                                        window['uploadNow'].trigger(document.querySelector("[ng-model=image]"))
                                      else{
                                        $scope.createExpense()
                                      }
                                    }
                              }
       }


   Event.find(credentials, actions)
   window['uploadNow'].bind({auth_token: UserService.currentUser.auth_token
                        , company_id: CompanyService.getCompanyId()
                        , event_id: $stateParams.eventId
                        , url: 'http://stage.brandscopic.com/api/v1/events/'+ $stateParams.eventId +'/photos/form.json?'
                        , noBind: true
                       })

   $scope.$on('createPhoto', function(e, data){
     if (!data.render) {
       $scope.event_expense.receipt_attributes = { direct_upload_url: data.direct_upload_url }
       $scope.createExpense()
     }

   })

}

module.controller('EventsExpensesAddController'
                  , controller).$inject = [  '$scope'
                                           , '$state'
                                           , '$stateParams'
                                           , '$location'
                                           , 'snapRemote'
                                           , 'UserService'
                                           , 'CompanyService'
                                           , 'UserInterface'
                                           , 'Event'
                                           , 'Expense'
                                          ]

