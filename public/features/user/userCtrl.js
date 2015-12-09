angular.module('groupScoop').controller('userCtrl', function ($rootScope, $scope, authService, userService, groupService, socketService) {

    // GET AUTHENTICATED USER AND THEIR GROUPS ON PAGE LOAD //
    $scope.getAuthUser = function () {
        authService.getUser().then(function (user) {
            console.log('MY DATA: ', user);
            $rootScope.user = user;
            $scope.user = user;
            $scope.myGroups = user.groups;
            $scope.myInvites = user.invitations;
            $scope.myGroupIds = [];
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            console.log($scope.myGroupIds);
            // Logged in user channels of groups the belong to for socket.io //
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
        }).catch(function (error) {
            console.log('Error', error);
        })
    };
    $scope.getAuthUser();

 
    // CREATE NEW GROUP //
    $scope.createGroupBox = function () {
        $scope.createNewGroupBox = !$scope.createNewGroupBox;
        userService.searchUsers().then(function (response) {
            console.log('users in DB ', response);
            $scope.users = response;
        })
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
            $scope.myGroups.push(response);
            $scope.myGroupIds = [];
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
        })
    };


    

    
    
    /////////// SELECT USER AND POST TO INVITES LIST AND SEND ALL INVITES TO GROUP AT ONE TIME ////
    
    // Clear input once name is selected //
    $scope.clearInput = function (id) {
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
        }
        else {
            $scope.$broadcast('angucomplete-alt:clearInput');
        }
    };

    $scope.invitesList = [];
    $scope.addPersonToInviteList = function (event, id) {
        if (event.keyCode === 13) {
            if ($scope.selectedPerson) {
                var namesInList = $scope.invitesList.map(function (name) {
                    return name.title;
                });
                if (namesInList.indexOf($scope.selectedPerson.title) === -1) {
                    console.log($scope.selectedPerson);
                    $scope.invitesList.push($scope.selectedPerson);
                    $scope.clearInput(id);
                }
            }
            console.log('invites List ', $scope.invitesList);
        };

    };

    // TO SHOW WHO HAS BEEN SELECTED FOR INVITE FOR THE NEW GROUP //
 


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
            for (var i = 0; i < $scope.myGroups.length; i++) {
                $scope.myGroupIds.push($scope.myGroups[i]._id);
            };
            socketService.emit('connectedUserGroups', $scope.myGroupIds);
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

    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        console.log('$Destroy triggered!');
    });



});