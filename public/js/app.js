angular.module('groupScoop', ['ngMaterial', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

        .state('home', {
            url: '/',
            templateUrl: './features/home/homeTmpl.html',
            controller: 'homeCtrl'
        })

        .state('user', {
            url: '/user/:id',
            templateUrl: './features/user/userTmpl.html',
            controller: 'userCtrl'
        })

        .state('group', {
            url: '/group/:id',
            templateUrl: './features/group/groupTmpl.html',
            controller: 'groupCtrl'
            // onEnter: function (socketService) {
            //     socketService.connect();
            // },
            // onExit: function (socketService) {
            //     socketService.disconnect();
            // }
        })

    $urlRouterProvider
        .otherwise('/');


});