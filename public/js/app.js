angular.module('groupScoop', ['angucomplete-alt', 'ngMaterial', 'ui.router']).config(function ($stateProvider, $urlRouterProvider) {

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
            controller: 'groupCtrl',
            resolve: {
                group: function(groupService, $stateParams){
                    return groupService.getGroup($stateParams.id);
                }
            }
  
        })

    $urlRouterProvider
        .otherwise('/');


});