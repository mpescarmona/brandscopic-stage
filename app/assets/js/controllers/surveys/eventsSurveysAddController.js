function eventsSurveysAddController($scope, $state, $stateParams, $location,  snapRemote, UserService, CompanyService, surveysService, UserInterface, Event, Surveys) {
    if( !UserService.isLogged() ) {
      $state.go('login');
      return;
    }
    snapRemote.close()

    $scope.gendersList = surveysService.genders;
    $scope.racesList = surveysService.races;
    $scope.agesList = surveysService.ages;
    $scope.likehoodList = surveysService.likehood;

    $scope.questions = {};
    $scope.questions.brandsQuestion1 = [];
    $scope.questions.brandsQuestion2 = [];
    $scope.questions.brandsQuestion3 = [];
    $scope.questions.brandsQuestion4 = [];

    surveysService.getBrandslist().then( function (response){
        $scope.brandslist = response;
        angular.forEach(response, function (brand){
            $scope.questions.brandsQuestion1.push({
                brand_id: brand.id, question_id: 1, name: brand.name, model: brand.id + "_model"
            });
            $scope.questions.brandsQuestion2.push({
                brand_id: brand.id, question_id: 2, name: brand.name, model: brand.id + "_model"
            });
            $scope.questions.brandsQuestion3.push({
                brand_id: brand.id, question_id: 3, name: brand.name, model: brand.id + "_model"
            });
            $scope.questions.brandsQuestion4.push({
                brand_id: brand.id, question_id: 4, name: brand.name, model: brand.id + "_model"
            });
        });
    }, function (response) {
        console.log(response);
    });

    var
        ui = {title: "Survey", hasMenuIcon: false, hasDeleteIcon: true, hasBackIcon: false, hasMagnifierIcon: false, hasAddIcon: false, hasSaveIcon: true, hasEditSurveyIcon: false, hasCancelIcon: false, hasCloseIcon: false, showEventSubNav: true, searching: false, eventSubNav: "surveys", AddIconState: ""}
      , credentials = { company_id: CompanyService.getCompanyId(), auth_token: UserService.currentUser.auth_token, event_id: $stateParams.eventId }
      , actions = { success: function(event){
                                    $scope.event = event;
                                    // Options for User Interface in home partial
                                    angular.extend(UserInterface, ui)
                                    $scope.UserInterface = UserInterface;
                                    $scope.eventId = $stateParams.eventId;

                                    $scope.createSurvey = function() {
                                        var surveyModel = {
                                          survey: {
                                            surveys_answers_attributes: []
                                          }
                                        }
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 6, answer: $scope.genderSelected });
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 7, answer: $scope.ageSelected });
                                        surveyModel.survey.surveys_answers_attributes.push({ kpi_id: 8, answer: $scope.raceSelected });
                                        angular.forEach($scope.questions, function (questions) {
                                            angular.forEach(questions, function (question) {
                                               surveyModel.survey.surveys_answers_attributes.push({ brand_id: question.brand_id, question_id: question.question_id, answer: question.model });
                                            })
                                        });

                                        surveysService.createSurvey(surveyModel).then( function (response) {
                                            $scope.survey = response
                                            $location.path("/home/events/" + event.id + "/surveys")
                                        }, function (response) {
                                            console.log(response);
                                        });
                                    }
                              }
       }

    Event.find(credentials, actions)
}

eventsSurveysAddController.$inject = [
  '$scope',
  '$state',
  '$stateParams',
  '$location',
  'snapRemote',
  'UserService',
  'CompanyService',
  'surveysService',
  'UserInterface',
  'Event',
  'Surveys'
];
