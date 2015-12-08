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
            // console.log('service grp data: ', response.data.posts);
            response.data.posts = response.data.posts.reverse();
            
            
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
    






});