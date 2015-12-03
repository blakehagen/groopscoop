angular.module('groupScoop', ['ngMaterial', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: './features/home/homeTmpl.html',
            controller: 'homeCtrl'
        })
        .state('login', {
            url: '/login',
            templateUrl: './features/login/loginTmpl.html',
            controller: 'loginCtrl'
        })
        .state('user', {
            url: '/user',
            templateUrl: './features/user/userTmpl.html',
            controller: 'userCtrl'
        })
        .state('group', {
            url: '/group',
            templateUrl: './features/group/groupTmpl.html',
            controller: 'groupCtrl'
        })

    $urlRouterProvider
        .otherwise('/');


});