angular.module('groupScoop').service('groupService', function ($http, $q) {

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

    this.getGroup = function (groupId) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/groups/' + groupId
        }).then(function (response) {
            deferred.resolve(response.data)
        })
        return deferred.promise
    };





});