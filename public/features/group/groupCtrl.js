angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService, userService, invitationService, $timeout, $stateParams, $location) {
    
//  if(!$rootScope.user){
//      $location.path('/');
//  };
   
    // // // // // // // // // // // // // // // // // // // // //
    // // GET GROUP DATA AFTER A GROUP IS SELECTED TO ENTER // //
    // // // // // // // // // // // // // // // // // // // // //
    
    // Get data of group that was clicked (via group service) //
    $scope.getGroupData = function (groupId) {
        groupService.getGroup(groupId).then(function (group) {
            $rootScope.groupData = group;
            $rootScope.groupData.groupNameUpperCase = group.groupName.toUpperCase();
            // console.log('grp data on userCtrl saved to $rootScope ', $rootScope.groupData);
            // Check if Members of Grp > 5 to show scroll icon //
            if ($rootScope.groupData.users.length > 5) {
                $scope.scrollMbr = true;
            } else {
                $scope.scrollMbr = false;
            };
        });
    };

    $scope.getGroupData($stateParams.id);
    
    // Check if groups > 5 to show scroll icon //
    if ($rootScope.user.groups.length > 5) {
        $scope.scrollGrps = true;
    } else {
        $scope.scrollGrps = false;
    };
    
    // USER OBJECT INFO FOR USE WITH NEW POSTS //
    var user = {
        id: $rootScope.user._id,
        google: {
            name: $rootScope.user.google.name,
            image: $rootScope.user.google.image
        },
        groups: $rootScope.user.groups
    };

    // POST NEW MESSAGE TO GROUP //
    $scope.postNew = function () {
        if (!$scope.newMessage) {
            return false;
        }
        $scope.postData = {
            postedBy: user.id,
            group: $rootScope.groupData._id,
            datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
            dateCreatedNonRead: new Date(),
            postContent: {
                message: $scope.newMessage,
                linkUrl: $scope.linkUrl
            }
        };
        // SEND NEW POST TO DB //
        groupService.postNewMessage($scope.postData).then(function (response) {
            console.log(response);
            $scope.newMessage = '';
            $scope.linkUrl = '';
            // TO UPDATE VIEW WHEN NEW POST //
            $scope.postData.postedBy = user;
            $scope.postData.postId = response._id;
            $scope.postData.dateCreatedNonRead = response.dateCreatedNonRead;
            console.log('data emit from grp ctrl: ', $scope.postData);
            socketService.emit('sendNewPost', $scope.postData);
        })
    };

    // Listening for New Posts //
    socketService.on('getNewPost', function (data) {
        console.log('socketdata coming back from server: ', data);
        if (data.group === $rootScope.groupData._id) {
            $rootScope.groupData.posts.unshift(data);
        }
    });
    
    // Listening for New Invitations //
    socketService.on('invitationGet', function (data) {
        // console.log('invitation socket data coming back from server: ', data);
        if (data._id === $rootScope.user._id) {
            $rootScope.myInvites.unshift(data.invitations[data.invitations.length - 1]);
        }
    });
    
    // Listening for New Members of Grp //
    socketService.on('userAdded', function (data) {
        // console.log('invitation socket data coming back from server: ', data);
        if (data === $stateParams.id) {
            $scope.getGroupData($stateParams.id);
        }
    });
    
    
    // Invite Others (Getting users from DB to search) //
    $scope.redPlus = true;
    $scope.openInviteBox = function () {
        $scope.grayPlusToggle = !$scope.grayPlusToggle;
        $scope.inviteOthers = !$scope.inviteOthers;
        if ($scope.inviteOthers === true) {
            userService.searchUsers().then(function (usersFromDb) {
                $scope.allUsers = usersFromDb;
                // console.log('invite others: ', $scope.allUsers);
            })
        }
    };

    // Toggle Action to send the invite to selected user //
    $scope.selectedUserToInvite = function (selected) {
        if (selected) {
            // console.log(selected);
            $scope.sendThisUserInvite = selected.description.id;
            $scope.redPlus = false;
            $scope.redPlusToggle = true;
            $scope.grayPlusToggle = false;
        }
    };

    $scope.sendIndividualInvite = function () {
        // console.log($scope.sendThisUserInvite);
        invitationService.sendOneInvite($scope.sendThisUserInvite, $rootScope.groupData._id);
        invitationService.clearInputForInvite();
        $scope.showInviteSuccess = true;
        $scope.redPlusToggle = false;
        $scope.grayPlusToggle = false;
        $timeout(function () {
            $scope.inviteOthers = false;
            $scope.redPlus = true;
            $scope.showInviteSuccess = false;
        }, 800);
    };
    
    // // // // // // // // // // // // // // // // // // // /
    // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // //
    // // // // // // // // // // // // // // // // // // // 
  
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        console.log('$Destroy triggered!');
    });
});