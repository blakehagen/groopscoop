angular.module('groupScoop').service('authService', function ($http, $q) {

    this.getUser = function () {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/user'
        }).success(function (response) {
            deferred.resolve(response);
        }).error(function(err){
            deferred.reject(err);
            console.log('SERVICE ERR', err);
        })
        return deferred.promise
    };
    
    
    
});

