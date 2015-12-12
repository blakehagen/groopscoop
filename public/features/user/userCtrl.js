angular.module('groupScoop').controller('userCtrl', function ($rootScope, $scope, authService, userService, groupService, socketService, invitationService, $state) {

    // // // // // // // // // // /
    // // GET AUTH USER INFO // // 
    // // // // // // // // // //

    // Gets user data on user view page load //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (user) {
            console.log('MY DATA: ', user);
            $rootScope.user = user;
            // Check if groups > 5 to show scroll icon //
            if ($rootScope.user.groups.length > 5) {
                $scope.scrollGrps = true;
            } else {
                $scope.scrollGrps = false;
            };
            $scope.user = user;
            $rootScope.myGroups = user.groups;
            $scope.myGroups = user.groups;
            $scope.myInvites = user.invitations;
            $scope.myGroupIds = [];
            // Auth user ids sent to socket.io to join rooms //
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
        }).catch(function (error) {
            console.log('Error', error);
        });
    };
    
    // Invoke the get user function //
    $scope.getAuthUser();


    // // // // // // // // // // // // // /
    // // AUTH USER CREATES NEW GROUP // //
    // // // // // // // // // // // // // 

    $rootScope.getUsersFromDatabase = function () {
        userService.searchUsers().then(function (usersFromDb) {
            $rootScope.users = usersFromDb;
            console.log('$RS users', $rootScope.users);
        });
    };
    
    // ** NEW GRP FORM INPUT ** Creating array of users that will be invited to the new group
    $scope.invitesList = [];
    $scope.addPersonToInviteList = function (event, id) {
        if (event.keyCode === 13) {
            if ($scope.selectedPerson) {
                var namesInList = $scope.invitesList.map(function (name) {
                    return name.title;
                });
                if (namesInList.indexOf($scope.selectedPerson.title) === -1) {
                    $scope.invitesList.push($scope.selectedPerson);
                    invitationService.clearInputForInvite(id);
                }
            }
        };
    };

    // ** NEW GRP FORM INPUT ** Group object created and on form completion new group info sent to server //
    $scope.createNewGroup = function () {
        if (!$scope.grpName) {
            return false;
        }
        var grp = {
            groupName: $scope.grpName,
            createdOn: moment().format('ddd MMM DD YYYY, h:mm a'),
            // Id of user who is creating the group //
            users: [$scope.user._id]
        };
        // New group created on server and returns new group data back //
        userService.createGroup(grp).then(function (newGrpData) {
            $scope.newGrpData = newGrpData;
            console.log('SUCCESS, GROUP CREATED: ', newGrpData);
            $scope.grpName = '';
            $scope.myGroups.push(newGrpData);
            $scope.myGroupIds = [];
            // Auth user ids sent to socket.io to join rooms //
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
            // Populate new group with group info //
            $scope.getGroupData($scope.newGrpData._id);
            // Sends invites to users that were selected //
            sendMultipleInvites();
            // Gets updated user object //
            $scope.getAuthUser();
            // Navigate to new group //
            $state.go('group', { id: $scope.newGroupId });
        })
    };
    
    // ** NEW GRP FORM INPUT ** Takes the invitesList array and sends out invite to all of them //
    function sendMultipleInvites() {
        $scope.invitesList.forEach(function (e) {
            invitationService.sendInviteFromCreateGroup(e.description.id, $scope.newGrpData._id);
        });
    };
    
    // // // // // // // // // // // // // //
    // // JOIN A GROUP (ACCEPT INVITE) // //
    // // // // // // // // // // // // // 
    
    // Join a group user has been invited to //
    $scope.acceptInvite = function (invite) {
        console.log('accepting this invitation: ', invite.groupInvitedTo);
        var acceptedInviteData = {
            inviteData: invite,
            acceptedBy: $scope.user._id
        };
        userService.acceptInvitation(acceptedInviteData).then(function (response) {
            console.log('I (auth\'d user) accepted an invite from someone else ', response);
            // Adds newly joined group to user's groups //
            $scope.updateGroupList();
            // Calls getInvites function to remove the newly accepted invite from user's data //
            $scope.getInvites();
        });
    };


    // // // // // // // // // // // /
    // // GET AUTH USER INVITES // //
    // // // // // // // // // // // 
    
    // Gets auth user's invites //
    $scope.getInvites = function () {
        userService.getInvitations($scope.user._id).then(function (response) {
            console.log('MY INVITATIONS: ', response);
            $scope.myInvites = response;
        });
    };
    
    
    // // // // // // // // // // // 
    // // GET AUTH USER GROUPS // // 
    // // // // // // // // // // // 
 
    // Get auth user's groups and updates the newly joined group to the list //
    $scope.updateGroupList = function () {
        userService.getGroups($scope.user._id).then(function (response) {
            console.log('this is newly added group: ', response);
            // The id below is used to find the group object in database to add the UserID //
            $scope.acceptedGroupId = response._id;
            // Sends the userId to update the group object in the database //
            $scope.updateGroupObj();
            $scope.myGroups.push(response);
            // Auth user ids sent to socket.io to join rooms //
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
        });
    };
    
    // Sends auth user id to update the group object in the database (via group service) //
    $scope.updateGroupObj = function () {
        groupService.updateGroup($scope.acceptedGroupId, $scope.user._id).then(function (response) {
            console.log('userId added to Group Object ', response);
        })
    };
    
    
    // // // // // // // // // // // // // // // // // // // // //
    // // GET GROUP DATA AFTER A GROUP IS SELECTED TO ENTER // //
    // // // // // // // // // // // // // // // // // // // // 
    
    // Get data of group that was clicked (via group service_ //
    $scope.getGroupData = function (groupId) {
        groupService.getGroup(groupId).then(function (group) {
            $rootScope.groupData = group;
            $rootScope.groupData.groupNameUpperCase = group.groupName.toUpperCase();
            console.log('grp data on userCtrl saved to $rootScope ', $rootScope.groupData);
        });
    };
    
    
    // // // // // // // // // // // // // // // // // // // //
    // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // // 
    // // // // // // // // // // // // // // // // // // //
  
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        console.log('$Destroy triggered!');
    });
});