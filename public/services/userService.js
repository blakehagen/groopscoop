angular.module('groupScoop').service('userService', function($http, $q){
    
    this.createGroup = function(grp){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: '/group',
            dataType: 'json',
            data: grp
        }).then(function(response){
            deferred.resolve(response.data);
        })
        return deferred.promise
    }
   
   
   
   
    
});