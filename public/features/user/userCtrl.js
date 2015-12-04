angular.module('groupScoop').controller('userCtrl', function ($scope, authService, userService, socketService) {

    var socket = io.connect();

    // GET AUTHENTICATED USER AND THEIR GROUPS //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (response) {
            console.log('MY DATA: ', response);
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
            console.log('SUCCESS - GROUP CREATED: ', response);
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
    // OPEN SEARCH FIELD //
    $scope.getUsers = function (idx, grpId) {
        idx.searchForUser = !idx.searchForUser;
        $scope.groupId = grpId;
        // GET USERS IN DB //
        userService.searchUsers().then(function (response) {
            $scope.users = response;
        })
    }
    // QUERY USERS //
    $scope.findUser = function (queryText) {
        var query = angular.lowercase(queryText);
        return $scope.users.filter(function (user) {
            return user.name.toLowerCase().indexOf(query) !== -1;
        })
    };

    // POST INVITE TO THE INVITED USER OBJ //
    $scope.sendInvite = function (invite) {
        console.log('INVITE OBJECT SENT: ', invite);
        invite.senderId = $scope.user._id;
        invite.invitedToThisGroup = $scope.groupId;
        userService.sendInvite(invite).then(function (response) {
            console.log(response);
        })
    }
    
    // GET INVITATIONS //
    $scope.getInvites = function () {
        userService.getInvitations($scope.user._id).then(function (response) {
            console.log('MY INVITATIONS: ', response);
        })
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