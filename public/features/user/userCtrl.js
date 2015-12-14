angular.module('groupScoop').controller('userCtrl', function ($rootScope, $scope, authService, userService, groupService, socketService, invitationService, $state) {

    // // // // // // // // // // /
    // // GET AUTH USER INFO // // 
    // // // // // // // // // //

    // Gets user data on user view page load //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (user) {
            console.log('MY DATA: ', user);
            $rootScope.getUsersFromDatabase();
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
            // $scope.myInvites = user.invitations;
            $rootScope.myInvites = user.invitations;
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
    $scope.addUserToInviteList = function (id) {
        if ($scope.selectedPerson) {
            $scope.inviteBox = true;
            console.log($scope.selectedPerson);
            var namesInList = $scope.invitesList.map(function (name) {
                return name.title;
            });
            if (namesInList.indexOf($scope.selectedPerson.title) === -1) {
                $scope.invitesList.push($scope.selectedPerson);
                invitationService.clearInputForInvite(id);
                $scope.selectedPerson = '';
            }
        }
        console.log('invitesList ', $scope.invitesList);
    };

    $scope.removeNameFromInviteList = function (name) {
        for (var i = 0; i < $scope.invitesList.length; i++) {
            if (name.invite.description.id === $scope.invitesList[i].description.id) {
                $scope.invitesList.splice(i, 1);
            }
        }
        console.log('invitesList ', $scope.invitesList);
    }

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
            // Sends invites to users that were selected //
            sendMultipleInvites();
            // Gets updated user object //
            $scope.getAuthUser();
            // Navigate to new group //
            $state.go('group', { id: $scope.newGrpData._id });
        })
    };
    
    // ** NEW GRP FORM INPUT ** Takes the invitesList array and sends out invite to all of them //
    function sendMultipleInvites() {
        $scope.invitesList.forEach(function (e) {
            invitationService.sendInviteFromCreateGroup(e.description.id, $scope.newGrpData._id);
        });
    };
    
    // Listening for New Invitations //
    socketService.on('invitationGet', function (data) {
        // console.log('invitation socket data coming back from server: ', data);
        if (data._id === $rootScope.user._id) {
            $rootScope.myInvites.unshift(data.invitations[data.invitations.length - 1]);
        }
    });
    
    // // // // // // // // // // // // // //
    // // JOIN A GROUP (ACCEPT INVITE) // //
    // // // // // // // // // // // // // 
    
    // Join a group user has been invited to //
    $rootScope.acceptInvite = function (invite) {
        // console.log('accepting this invitation: ', invite.groupInvitedTo);
        var acceptedInviteData = {
            inviteData: invite,
            acceptedBy: $scope.user._id
        };
        userService.acceptInvitation(acceptedInviteData).then(function (response) {
            // console.log('Auth\'d user accepted an invite from someone else ', response);
            // Adds newly joined group to user's groups //
            $scope.updateGroupList();
            $scope.getInvites();
            // Sends auth user id to update the group object in the database //
            groupService.updateGroup(invite.groupInvitedTo._id, $scope.user._id).then(function (response) {
                console.log('userId added to Group Object ', response);
                socketService.emit('userJoinedGrp', invite.groupInvitedTo._id)
            })
            $state.go('group', { id: invite.groupInvitedTo._id });
        });
    };


    // // // // // // // // // // // /
    // // GET AUTH USER INVITES // //
    // // // // // // // // // // // 
    
    // Gets auth user's invites //
    $scope.getInvites = function () {
        userService.getInvitations($scope.user._id).then(function (response) {
            // console.log('MY INVITATIONS: ', response);
            $rootScope.myInvites = response;
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
            // $scope.updateGroupObj();
            $scope.myGroups.push(response);
            // Auth user ids sent to socket.io to join rooms //
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
        });
    };
    
    // // // // // // // // // // // // // // // // // // // // //
    // // GET GROUP DATA AFTER A GROUP IS SELECTED TO ENTER // //
    // // // // // // // // // // // // // // // // // // // // 
    
    // Get data of group that was clicked (via group service_ //
    // $scope.getGroupData = function (groupId) {
    //     groupService.getGroup(groupId).then(function (group) {
    //         $rootScope.groupData = group;
    //         $rootScope.groupData.groupNameUpperCase = group.groupName.toUpperCase();
    //         console.log('grp data on userCtrl saved to $rootScope ', $rootScope.groupData);
    //     });
    // };
    
    
    // // // // // // // // // // // // // // // // // // // //
    // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // // 
    // // // // // // // // // // // // // // // // // // //
  
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        console.log('$Destroy triggered!');
    });








});