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





});