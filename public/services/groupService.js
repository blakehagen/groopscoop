angular.module('groupScoop').service('groupService', function ($http, $q) {

    // POSTING USER ID TO GROUP OBJECT //
    this.updateGroup = function (groupId, userId) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/groups/' + groupId,
            dataType: 'json',
            data: {
                users: userId
            }
        }).then(function (response) {
            deferred.resolve(response)
        })
        return deferred.promise
    };

    // GETTING GROUP DATA TO POPULATE GROUP VIEW - INCLUDES POSTS //
    this.getGroup = function (groupId) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/groups/' + groupId
        }).then(function (response) {
            // response.data.posts = response.data.posts.reverse();
            deferred.resolve(response.data)
        })
        return deferred.promise
    };
    
    // POST NEW MESSAGE TO GROUP //
    this.postNewMessage = function (postData) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/groups/' + postData.group + '/post',
            dataType: 'json',
            data: postData
        }).then(function (response) {
            deferred.resolve(response.data)
        })
        return deferred.promise
    };
    
    // GET COMMENTS FOR POST //
    this.getComments = function (postId) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/comments/' + postId
        }).then(function (response) {
            // console.log('get comments response on grpService', response)
            deferred.resolve(response.data)
        })
        return deferred.promise
    };
    
    // POST NEW COMMENT TO POST //
    this.postNewComment = function (commentData) {
        console.log(commentData);
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/comments/' + commentData.post,
            dataType: 'json',
            data: commentData
        }).then(function (response) {
            // console.log('post new comment ', response)
            deferred.resolve(response.data)
        })
        return deferred.promise
    };






});