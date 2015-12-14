angular.module('groupScoop').service('invitationService', function ($rootScope, userService, socketService) {
    
    // ** NEW GRP FORM INPUT ** Clear 'Invite Users' input once name is selected on form //
    this.clearInputForInvite = function (id) {
        if (id) {
            $rootScope.$broadcast('angucomplete-alt:clearInput', id);
        }
        else {
            $rootScope.$broadcast('angucomplete-alt:clearInput');
        }
    }
    
    // ** NEW GRP FORM INPUT ** Function that will send invites to server for each invited user //
    this.sendInviteFromCreateGroup = function (targetUserId, groupInvitedToId) {
        var invitation = {
            targetUserId: targetUserId,
            senderName: $rootScope.user.google.name,
            invitedTo: groupInvitedToId
        };
        userService.sendInvite(invitation).then(function (response) {
            // console.log(response.data);
            socketService.emit('invitationSend', response.data);
        });

    };


    this.sendOneInvite = function (targetUserId, groupInvitedToId) {
        var invitation = {
            targetUserId: targetUserId,
            senderName: $rootScope.user.google.name,
            invitedTo: groupInvitedToId
        };
        userService.sendInvite(invitation).then(function (response) {
            // console.log(response);
            socketService.emit('invitationSend', response.data);
        });
    }






});