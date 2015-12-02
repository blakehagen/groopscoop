angular.module('groupScoop').controller('userCtrl', function ($scope, authService, userService) {

    $scope.getAuthUser = function () {
        authService.getUser().then(function (response) {
            console.log(response);
            $scope.user = response
        })
    };

    $scope.getAuthUser();

    $scope.newGrp = false;
    $scope.createGroupButtons = function () {
        $scope.newGrp = !$scope.newGrp;
    }

    $scope.createNewGroup = function () {
        var users = [$scope.user._id];
        var grp = {
            "groupName" : $scope.grpName,
            "createdOn": moment().format('ddd MMM DD YYYY, h:mm a'),
            users: users
        };
        userService.createGroup(grp).then(function (response) {
            console.log(response);
            $scope.grpName = '';
            $scope.newGrp = !$scope.newGrp;

        })
    };



});