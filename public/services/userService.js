angular.module('groupScoop').service('userService', function ($http, $q) {

    // CREATE A NEW GROUP FROM USER VIEW //
    this.createGroup = function (grp) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/user',
            dataType: 'json',
            data: grp
        }).then(function (response) {
            deferred.resolve(response.data);
        })
        return deferred.promise
    };
    
    
    // GET ALL USERS TO INVITE TO GROUP //
    this.searchUsers = function () {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/users'
        }).then(function (response) {
            deferred.resolve(response.data)
        })
        return deferred.promise
    };








});