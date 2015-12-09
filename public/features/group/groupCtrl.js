angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService) {
    
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
            postContent: {
                message: $scope.newMessage
            }
        };
        // SEND NEW POST TO DB //
        groupService.postNewMessage($scope.postData).then(function (response) {
            // console.log(response);
            // TO UPDATE VIEW WHEN NEW POST //
            $scope.postData.postedBy = user;
            $scope.postData.postId = response._id
            socketService.emit('sendNewPost', $scope.postData);

        })
    };

    // Listening for New Posts //
    socketService.on('getNewPost', function (data) {
        console.log('socketdata coming back from server: ', data);
        $rootScope.groupData.posts.unshift(data);

        $scope.$digest();
    })

    $scope.disconnectSocket = function () {
        socketService.emit('disconnect');
        console.log('i sent this');

    }







});