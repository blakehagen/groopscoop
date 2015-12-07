angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService, socketService) {

    var socket = io.connect();
    
    // USER OBJECT TO SEND WITH POSTED MESSAGES //
    var user = {
        id: $rootScope.user._id,
        name: $rootScope.user.google.name,
        imgUrl: $rootScope.user.google.image,
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
            // Socket TEST FOR POST IN GRP //
            socketService.emit('sendNewPost', $scope.postData);
            socketService.on('getNewPost', function (data) {
                console.log('socket data', data);
                $scope.$digest();
            });

            console.log('i posted: ', response);
        })
    };



});