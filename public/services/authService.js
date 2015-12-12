angular.module('groupScoop').service('authService', function ($http, $q) {

    this.getUser = function () {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/user'
        }).success(function (response) {
            response.groups.sort(function (a, b) {
                var textA = a.groupName.toUpperCase();
                var textB = b.groupName.toUpperCase();
                return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
            });
            deferred.resolve(response);
        }).error(function (err) {
            deferred.reject(err);
            console.log('SERVICE ERR', err);
        })
        return deferred.promise
    };
});

