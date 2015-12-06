angular.module('groupScoop').controller('groupCtrl', function ($rootScope, $scope, groupService) {
    
    // USER OBJECT TO SEND WITH POSTED MESSAGES //
    // $scope.user = $rootScope.user;
    var user = {
        id: $rootScope.user._id,
        name: $rootScope.user.google.name,
        imgUrl: $rootScope.user.google.image,
        groups: $rootScope.user.groups
    };
    
    $scope.postNew = function () {
        var postData = {
            postedBy: user.id,
            group: $rootScope.groupData._id,
            datePosted: moment().format('ddd MMM DD YYYY, h:mm a'),
            postContent: {
                message: $scope.newMessage
            }
        };
        
        groupService.postNewMessage(postData).then(function(response){
            console.log('i posted: ', response);
        })
    };

});