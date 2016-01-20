angular.module('groupScoop').directive('commentsDirective', function () {
    return {
        restrict: 'E',
        templateUrl: '/directives/comments/commentsTmpl.html',
        scope: {
            postId: '=',
            authedUser: '='

        },

        controller: function ($scope, groupService) {
            
            // console.log('userId', $scope);
            $scope.getComments = function (postId) {

                groupService.getComments(postId).then(function (response) {
                    console.log('get comments on grpCtrl', response);

                    $scope.comments = response;
                })
            }

            $scope.toggleLinkInputComments = function (thisBox) {
                thisBox.linkInputComments = !thisBox.linkInputComments;
            }

            $scope.toggleComments = function () {
                $scope.commentsBox = !$scope.commentsBox;
                if ($scope.commentsBox) {
                    $scope.getComments($scope.postId);
                }
                // $scope.$apply();
            }



            $scope.submitComment = function () {
                $scope.commentData = {
                    postedBy: $scope.authedUser.id,
                    datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
                    post: $scope.postId,
                    dateCreatedNonRead: new Date(),
                    commentMessage: $scope.commentMsg
                };

                $scope.commentMsg = '';

                groupService.postNewComment($scope.commentData).then(function (comment) {
                    console.log(comment);
                    $scope.getComments($scope.postId);

                })
            };
        }

        // link: function (scope, elem, attrs) {
        //     // console.log('attrs', attrs);
        //     var postButton = elem.find('.comment-post-btn');
        //     console.log(postButton);
        //     elem.on('click', function () {
        //         // if (scope.commentsBox) {
        //         //     scope.getComments(scope.postId);
        //         // }
        //         // scope.$apply();
        //     })
        // }
    }

});