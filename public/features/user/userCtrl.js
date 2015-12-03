angular.module('groupScoop').controller('userCtrl', function ($scope, authService, userService, socketService) {

    var socket = io.connect();

    // GET AUTHENTICATED USER AND THEIR GROUPS //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (response) {
            console.log('myData: ', response);
            $scope.user = response[0];
            $scope.myGroups = response[1];
        })
    };
    $scope.getAuthUser();


    // CREATE NEW GROUP //
    $scope.newGrp = false;
    $scope.createGroupButtons = function () {
        $scope.newGrp = !$scope.newGrp;
    }

    $scope.createNewGroup = function () {
        var users = [$scope.user._id];
        var grp = {
            "groupName": $scope.grpName,
            "createdOn": moment().format('ddd MMM DD YYYY, h:mm a'),
            users: users
        };

        userService.createGroup(grp).then(function (response) {
            console.log('Success: ', response);
            $scope.grpName = '';
            $scope.newGrp = !$scope.newGrp;
        })

        socketService.emit('createNewGroup', grp);
    };

    socketService.on('getGroups', function (data) {
        $scope.myGroups.push(data);
        $scope.$digest();
    });
    
    
    // INVITE USER TO GROUP //

    $scope.getUsers = function (idx) {
        idx.searchForUser = !idx.searchForUser;

        userService.searchUsers().then(function (response) {

            console.log(response);
            $scope.users = response;
        })
    }

    $scope.findUser = function (queryText) {
        var query = angular.lowercase(queryText);
        return $scope.users.filter(function (user) {

            return user.name.indexOf(query) !== -1;
        })
    };

    $scope.sendInvite = function (user) {
        console.log('inviting ', user);
    }





    
    // SOCKET TESTS //

    $scope.messages = [];

    $scope.send = function () {
        socketService.emit('sendMsg', $scope.msg);
    };

    socketService.on('getMsg', function (data) {
        $scope.messages.push(data);
        $scope.$digest();
    });











});