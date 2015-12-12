angular.module('groupScoop', ['angucomplete-alt', 'ngMaterial', 'ui.router', 'angularMoment']).config(function ($stateProvider, $urlRouterProvider) {

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

        .state('createGroup', {
            url: '/user/:id/create',
            templateUrl: './features/user/createGroupRouteTmpl.html',
            controller: 'userCtrl'
        })

        .state('group', {
            url: '/group/:id',
            templateUrl: './features/group/groupTmpl.html',
            controller: 'groupCtrl'
        })

    $urlRouterProvider
        .otherwise('/');
});