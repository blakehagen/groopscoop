angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService) {

    var socket = io.connect();
    
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
        groupService.postNewMessage($scope.postData).then(function (response) {
            // TO UPDATE VIEW WHEN NEW POST //
            $scope.postData.postedBy = user;
            socketService.emit('sendNewPost', $scope.postData);
        })
    };

    // Listening for New Posts //
    socketService.on('getNewPost', function (data) {
        console.log('socketdata: ', data);
        if (data.group === $rootScope.groupData._id) {
            $rootScope.groupData.posts.unshift(data);
        }
        $scope.$digest();
    });



});