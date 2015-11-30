angular.module('groupScoop').controller('userCtrl', function ($scope, authService) {

    $scope.getAuthUser = function () {
        authService.getUser().then(function (response) {
            console.log(response);
            $scope.user = response
        })
    };

    $scope.getAuthUser();




});