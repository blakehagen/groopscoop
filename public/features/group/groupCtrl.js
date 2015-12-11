angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService, userService) {
    
    // // // // // // // // // // // // // // // // // // // // // // // // // // ///
    // // // // // // GET GROUP DATA AFTER A GROUP IS SELECTED TO ENTER // // // // // 
    // // // // // // // // // // // // // // // // // // // // // // // // // // ///
    
    // Get data of group that was clicked (via group service) //
    $scope.getGroupData = function (groupId) {
        groupService.getGroup(groupId).then(function (group) {
            $rootScope.groupData = group;
            $rootScope.groupData.groupNameUpperCase = group.groupName.toUpperCase();
            console.log('grp data on userCtrl saved to $rootScope ', $rootScope.groupData);
        });
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
        $scope.postData = {
            postedBy: user.id,
            group: $rootScope.groupData._id,
            datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
            dateCreatedNonRead: new Date(),
            postContent: {
                message: $scope.newMessage
            }
        };
        // SEND NEW POST TO DB //
        groupService.postNewMessage($scope.postData).then(function (response) {
            console.log(response);
            $scope.newMessage = '';
            // TO UPDATE VIEW WHEN NEW POST //
            $scope.postData.postedBy = user;
            $scope.postData.postId = response._id;
            $scope.postData.dateCreatedNonRead = response.dateCreatedNonRead;
            // console.log('data emit from grp ctrl: ', $scope.postData);
            socketService.emit('sendNewPost', $scope.postData);
        })
    };

    // Listening for New Posts //
    socketService.on('getNewPost', function (data) {
        // console.log('socketdata coming back from server: ', data);
        if (data.group === $rootScope.groupData._id) {
            $rootScope.groupData.posts.unshift(data);
        }
    });
    
    // Invite Others (Getting users from DB to search) //
    $scope.openInviteBox = function () {
        $scope.inviteOthers = !$scope.inviteOthers;
        if ($scope.inviteOthers === true) {
            userService.searchUsers().then(function (usersFromDb) {
                $scope.allUsers = usersFromDb;
                console.log('invite others: ', $scope.allUsers);
            })
        }
    };

    // Toggle Action to send the invite to selected user //
    $scope.selectedUserToInvite = function (selected) {
        if (selected) {
            $scope.redPlus = !$scope.redPlus;
            $scope.redPlusToggle = !$scope.redPlusToggle;
            $scope.grayPlusToggle = ! $scope.grayPlusToggle;
            console.log('User is selected');
        }
    };
    
    $scope.sendIndividualInvite = function(){
        
    }
    
    
    

    
    // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // // // // // 
    // // // // // // // // // // // // // // // // // // // // // // // // // // //
  
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        console.log('$Destroy triggered!');
    });


});