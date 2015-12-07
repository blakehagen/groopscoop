angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService) {

    var socket = io.connect();
    
    // USER OBJECT TO SEND WITH POSTED MESSAGES //
    var user = {
        id: $rootScope.user._id,
        google: {
            name: $rootScope.user.google.name,
            image: $rootScope.user.google.image
        },
        groups: $rootScope.user.groups
    };

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
            // console.log('response back after sending new post to db ', response);
            $scope.postData.postedBy = user;
            $rootScope.groupData.posts.push($scope.postData);
            console.log('adding new post to rootscope: ', $rootScope.groupData.posts);
        })
    };



});