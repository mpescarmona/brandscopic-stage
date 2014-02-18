function eventsSurveysAddController($scope, $state, $stateParams, snapRemote, UserService, CompanyService, surveysService, UserInterface, Event, Surveys) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gendersList = surveysService.genders;
    $scope.racesList = surveysService.races;
    $scope.agesList = surveysService.ages;
    $scope.likehoodList = surveysService.likehood;

    // Set default option selected
    $scope.answerQuestion2Brand1 = "Choose_option";
    $scope.answerQuestion2Brand2 = "Choose_option";
    $scope.answerQuestion2Brand3 = "Choose_option";

    $scope.answerQuestion3Brand1 = "Choose_option";
    $scope.answerQuestion3Brand2 = "Choose_option";
    $scope.answerQuestion3Brand3 = "Choose_option";

    var
        ui = {title: "Survey", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "expenses", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;

                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.createSurvey = function() {
                                        $scope.survey = {
                                            surveys_answers_attributes: [
                                                { kpi_id: 6, answer: $scope.genderSelected },
                                                { kpi_id: 7, answer: $scope.ageSelected },
                                                { kpi_id: 8, answer: $scope.raceSelected },
                                                { brand_id: 1, question_id: 1, answer: $scope.answerQuestion1Brand1 },
                                                { brand_id: 2, question_id: 1, answer: $scope.answerQuestion1Brand2 },
                                                { brand_id: 3, question_id: 1, answer: $scope.answerQuestion1Brand3 },
                                                { brand_id: 1, question_id: 2, answer: $scope.answerQuestion2Brand1 },
                                                { brand_id: 2, question_id: 2, answer: $scope.answerQuestion2Brand2 },
                                                { brand_id: 1, question_id: 3, answer: $scope.answerQuestion3Brand1 },
                                                { brand_id: 2, question_id: 3, answer: $scope.answerQuestion3Brand2 },
                                                { brand_id: 3, question_id: 3, answer: $scope.answerQuestion3Brand3 },
                                                { brand_id: 1, question_id: 4, answer: $scope.answerQuestion4Brand1 },
                                                { brand_id: 2, question_id: 4, answer: $scope.answerQuestion4Brand2 },
                                                { brand_id: 3, question_id: 4, answer: $scope.answerQuestion4Brand3 }
                                            ]
                                        }

                                      var
                                          credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
                                        , actions = { success: function (survey) {
                                                            alert("success");
                                                            //console.log(survey)
                                                            $scope.survey = survey
                                                            $location.path("/home/events/" + event.id + "/surveys")
                                                      }
                                                    , error: function (survey_error) {
                                                        $scope.survey_error = survey_error
                                                         console.log(survey_error)
                                                      }
                                                    }

                                      Surveys.create(credentials, actions, $scope.survey)
                                    }
                              }
       }

    Event.find(credentials, actions)
}

eventsSurveysAddController.$inject = [
  '$scope', 
  '$state', 
  '$stateParams', 
  'snapRemote', 
  'UserService',
  'CompanyService',
  'surveysService',
  'UserInterface', 
  'Event',
  'Surveys'
];
