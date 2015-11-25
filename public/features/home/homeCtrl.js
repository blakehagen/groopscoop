angular.module('groupScoop').controller('homeCtrl', function($scope, testService){
    
    $scope.test = 'Hello world!'
    
    $scope.testPost = function(){
        testService.newPost($scope.newPost).then(function(response){
            console.log(response);
        })
    }
    
    
    
});