angular.module('groupScoop').controller('homeCtrl', function ($scope, socketService) {
    
    // // // // // // // // // // // // // // // // // // // // // // // // // // //
    // // // // // // DESTROY SOCKET CONNECTIONS TO AVOID DUPLICATES // // // // // 
    // // // // // // // // // // // // // // // // // // // // // // // // // // //
  
    $scope.$on('$destroy', function (event) {
        socketService.removeAllListeners();
        // console.log('$Destroy triggered!');
    });

});
