angular.module('groupScoop').service('authService', function ($http, $q) {

    this.getUser = function () {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/user'
        }).then(function (response) {
            deferred.resolve(response.data);
        })
        return deferred.promise
    };
});