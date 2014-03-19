function eventsSurveysParentController($scope, surveysService) {
    'use strict';

    $scope.gendersList = surveysService.genders;
    $scope.racesList = surveysService.races;
    $scope.agesList = surveysService.ages;
    $scope.likehoodList = surveysService.likehood;
    $scope.genderModel = { genderSelected : ""}
    $scope.raceModel = { raceSelected : ""}
    $scope.ageModel = { ageSelected : ""}
    $scope.questions = {};
    $scope.questions.brandsQuestion1 = [];
    $scope.questions.brandsQuestion2 = [];
    $scope.questions.brandsQuestion3 = [];
    $scope.questions.brandsQuestion4 = [];

    surveysService.getBrandslist().then( function (response){
        $scope.brandslist = response;
        angular.forEach(response, function (brand){
            $scope.questions.brandsQuestion1.push({
                id: 0 ,brand_id: brand.id, question_id: 1, name: brand.name, model: brand.id + "_model"
            });
            $scope.questions.brandsQuestion2.push({
                id: 0, brand_id: brand.id, question_id: 2, name: brand.name, model: brand.id + "_model", input_id: "question2" + brand.id
            });
            $scope.questions.brandsQuestion3.push({
                id: 0, brand_id: brand.id, question_id: 3, name: brand.name, model: brand.id + "_model", input_id: "question3" + brand.id
            });
            $scope.questions.brandsQuestion4.push({
                id: 0, brand_id: brand.id, question_id: 4, name: brand.name, model: brand.id + "_model", input_id: "question4" + brand.id
            });
        });
    }, function (response) {
        console.log(response);
    });
}

eventsSurveysParentController.$inject = [
    '$scope',
    'surveysService'
];
