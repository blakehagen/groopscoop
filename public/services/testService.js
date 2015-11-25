angular.module('groupScoop').service('testService', function($http, $q){
    
    this.newPost = function(data){
        var deferred = $q.defer();
        $http({
            method: 'POST',
            url: 'http://localhost:3000/api/test',
            dataType: 'json',
            data: {
                msg: data,
                created: Date()
            }
        }).then(function(response){
            console.log(response);
            deferred.resolve(response.data)
        })
        return deferred.promise
        
    };
    
    
    
    
});