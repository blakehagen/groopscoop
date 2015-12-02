angular.module('groupScoop').controller('userCtrl', function ($scope, authService, userService, socketService) {

    var socket = io.connect();

    // GET AUTHENTICATED USER AND THEIR GROUPS //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (response) {
            console.log(response);
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
            console.log(response);
            $scope.grpName = '';
            $scope.newGrp = !$scope.newGrp;
        })

        socketService.emit('createNewGroup', grp);
    };

    socketService.on('getGroups', function (data) {
        console.log('event fired');
        $scope.myGroups.push(data);
        $scope.$digest();
    });
    
    
    
 
    
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