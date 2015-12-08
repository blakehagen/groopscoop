angular.module('groupScoop')

// .service(['socketService', function ($rootScope) {

//         var socket = io.connect();
//         return socket;
   
// }]);

    .factory('socketService', ['$rootScope', function ($rootScope) {
        var socket = io.connect();

        return {
            on: function (eventName, callback) {
                socket.on(eventName, callback);
            },
            emit: function (eventName, data) {
                socket.emit(eventName, data);
            }
        };
    }]);