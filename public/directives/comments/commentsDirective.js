angular.module('groupScoop').directive('commentsDirective', function () {
    return {
        restrict: 'E',
        templateUrl: '/directives/comments/commentsTmpl.html',
        scope: {
            postId: '=',
            authedUser: '='
        },

        controller: function ($scope, groupService, socketService) {
            
            // console.log('userId', $scope);
            $scope.getComments = function (postId) {

                groupService.getComments(postId).then(function (response) {
                    $scope.comments = [];
                    // console.log('get comments on commentsDirective', response);
                    $scope.comments = response;
                    // console.log('comments array ', $scope.comments);
                })
            };

            $scope.toggleLinkInputComments = function (thisBox) {
                thisBox.linkInputComments = !thisBox.linkInputComments;
            };

            $scope.toggleComments = function () {
                $scope.commentsBox = !$scope.commentsBox;
                if ($scope.commentsBox) {
                    $scope.getComments($scope.postId);
                }
                // $scope.$apply();
            };



            $scope.submitComment = function () {
                $scope.commentData = {
                    postedBy: $scope.authedUser.id,
                    postedByName: $scope.authedUser.name,
                    postedByImage: $scope.authedUser.img,
                    datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
                    post: $scope.postId,
                    dateCreatedNonRead: new Date(),
                    commentMessage: $scope.commentMsg
                };

                $scope.commentMsg = '';

                groupService.postNewComment($scope.commentData).then(function (comment) {
                    // console.log(comment);
                    // $scope.getComments($scope.postId);
                     
                    // SOCKET.IO FOR COMMENTS //
                    socketService.emit('sendNewComment', comment);
                    // console.log('new comment sending via socket.io: ', comment);
                })
            };
            
            // LISTENING FOR NEW COMMENT //
            socketService.on('getNewComment', function (data) {
                // console.log('socketdata coming back from server after new comment: ', data);
                
                if(data.post === $scope.postId){
                    $scope.comments.push(data);
                    // console.log('did it');
                    // console.log('comments array: ', $scope.comments);
                    return false;
                }
                return false;
              
            });
        }
    }

});