angular.module('groupScoop').service('authService', function ($http, $q) {


    this.getUser = function () {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/user'
        }).then(function (response) {
            // console.log(response);
            deferred.resolve(response.data);
        })
        return deferred.promise
    };

});