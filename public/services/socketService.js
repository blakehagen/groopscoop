angular.module('groupScoop').factory('socketService', ['$rootScope', function ($rootScope) {
    var socket = io.connect('http://localhost:3000', { forceNew: true });

    // return {

    //     on: function (eventName, callback) {
    //         socket.connect('http://localhost:3000',{forceNew: true});
    //         socket.on(eventName, callback);
            
    //         console.log('socket connected on ', socket.id, socket);
    //     },
    //     emit: function (eventName, data) {
    //         socket.emit(eventName, data);
    //     },

    //     disconnect: function () {
    //         console.log('I am disconnecting socket ', socket.id, socket);
    //         socket.manager.onClientDisconnect(socket.id);

    //         // socket.io.close();
    //     }
    // };
    
    
    return {
        removeAllListeners: function (eventName, callback) {
            socket.removeAllListeners();
        },
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };


}]);