angular.module('groupScoop', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: './features/home/homeTmpl.html',
            controller: 'homeCtrl'
        })
        .state('user-view', {
            url: '/user',
            templateUrl: './features/user-view/userTmpl.html',
            controller: 'userCtrl'
        })
        .state('group-view', {
            url: '/group',
            templateUrl: './features/group-view/groupTmpl.html',
            controller: 'groupCtrl'
        })

    $urlRouterProvider
        .otherwise('/');


});