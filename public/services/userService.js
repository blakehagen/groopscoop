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
    
    // SEND AN INVITE TO A USER FOR A SPECIFIC GROUP //
    this.sendInvite = function (invite) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/user/invite',
            dataType: 'json',
            data: invite
        }).then(function (response) {
            var success = {
                msg: response.data,
                status: response.status
            };
            deferred.resolve(success);
        })
        return deferred.promise
    };

    // GET AUTH'D USER INVITES //
    this.getInvitations = function (id) {
        var deferred = $q.defer();
        $http({
            method: 'GET',
            url: '/api/v1/user/invite/',
            dataType: 'json',
            data: id
        }).then(function (response) {
            deferred.resolve(response.data)
        })
        return deferred.promise
    };
    
    // AUTH'D USER ACCEPTS INVITE //
    this.acceptInvitation = function (acceptedInvite) {
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/api/v1/user/invite/accept',
            dataType: 'json',
            data: acceptedInvite
        }).then(function (response) {

            deferred.resolve(response);
        })
        return deferred.promise
    };








});