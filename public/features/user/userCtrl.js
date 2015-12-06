angular.module('groupScoop').controller('userCtrl', function ($rootScope, $scope, authService, userService, groupService, socketService) {

    var socket = io.connect();

    // GET AUTHENTICATED USER AND THEIR GROUPS ON PAGE LOAD //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (user) {
            console.log('MY DATA: ', user);
            $rootScope.user = user;
            $scope.user = user;
            $scope.myGroups = user.groups;
            $scope.myInvitations = user.invitations;
        }).catch(function (error) {
            console.log('Error', error);
        })
    };
    $scope.getAuthUser();


    // CREATE NEW GROUP //
    $scope.newGrp = false;
    $scope.createGroupButtons = function () {
        $scope.newGrp = !$scope.newGrp;
    }

    $scope.createNewGroup = function () {
        var grp = {
            groupName: $scope.grpName,
            createdOn: moment().format('ddd MMM DD YYYY, h:mm a'),
            users: [$scope.user._id]
        };

        userService.createGroup(grp).then(function (response) {
            console.log('SUCCESS, GROUP CREATED: ', response);
            $scope.grpName = '';
            $scope.newGrp = !$scope.newGrp;
            $scope.myGroups.push(response);
        })
    };
    

    // INVITE USER TO GROUP //
    // OPEN SEARCH FIELD //
    $scope.getUsers = function (idx, grpId) {
        idx.searchForUser = !idx.searchForUser;
        $scope.groupId = grpId;
        // GET USERS IN DB //
        userService.searchUsers().then(function (response) {
            $scope.users = response;
        })
    };
    
    // QUERY USERS //
    $scope.findUser = function (queryText) {
        var query = angular.lowercase(queryText);
        return $scope.users.filter(function (user) {
            return user.name.toLowerCase().indexOf(query) !== -1;
        });
    };

    // POST INVITE TO THE INVITED USER OBJ //
    $scope.sendInvite = function (targetUserId) {
        var invitation = {
            targetUserId: targetUserId,
            senderName: $scope.user.google.name,
            invitedTo: $scope.groupId
        };
        userService.sendInvite(invitation).then(function (response) {
            console.log(response);
        });
    };
    
    // GET INVITATIONS //
    $scope.getInvites = function () {
        userService.getInvitations($scope.user._id).then(function (response) {
            console.log('MY INVITATIONS: ', response);
            $scope.myInvites = response;
        });
    };
    
    // ACCEPT INVITATIONS //
    $scope.acceptInvite = function (invite) {
        var acceptedInviteData = {
            inviteData: invite,
            acceptedBy: $scope.user._id
        };
        userService.acceptInvitation(acceptedInviteData).then(function (response) {
            console.log('I (auth\'d user) accepted an invite from someone else ', response);
            $scope.updateGroupList(); // --> add new group to myGroups
            $scope.getInvites(); // --> to remove accepted invite
        });
    };
    
    //GET ALL AUTH'D USER's GROUPS //
    $scope.updateGroupList = function () {
        userService.getGroups().then(function (response) {
            console.log('this is newly added group: ', response);
            $scope.newGroupId = response._id; // --> This ID will be used to find the GroupObj to add the UserID
            $scope.updateGroupObj(); // --> update the groupObj with UserId
            $scope.myGroups.push(response);
        });
    };
    
    // UPDATE A GROUP OBJ WITH USER ID (SENDING VIA GROUP SERVICE) //
    $scope.updateGroupObj = function () {
        groupService.updateGroup($scope.newGroupId, $scope.user._id).then(function (response) {
            console.log('userId added to Group Object ', response)
        })
    };
    
    // GET GROUP DATA AFTER USER CLICKS (SENDING VIA GROUP SERVICE) //
    $scope.getGroupData = function (groupId) {
        groupService.getGroup(groupId).then(function (group) {
            $rootScope.groupData = group;
            console.log('grp data on userCtrl saved to $rootScope ', $rootScope.groupData);
        });
    };

    
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